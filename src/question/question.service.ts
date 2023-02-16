import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Response } from '../response/entities/response.entity';
import { Survey } from '../survey/entities/survey.entity';
import { CreatePickedQuestionInput } from './dto/create-pickedQuestion.input';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { PickedQuestion } from './entities/pickedQuestion.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private pickedQuestionRepository: Repository<PickedQuestion>,
    private entityManager: EntityManager,
  ) {}

  async create(input: CreateQuestionInput) {
    const question = this.questionRepository.create(input);
    question.survey = await this.entityManager.findOneById(
      Survey,
      input.surveyId,
    );
    return this.entityManager.save(question);
  }

  findAll() {
    return this.questionRepository.find();
  }

  findOne(questionId: number) {
    this.validQuestionById(questionId);
    return this.questionRepository.findOneBy({ questionId });
  }

  async update(questionId: number, updateQuestionInput: UpdateQuestionInput) {
    this.validQuestionById(questionId);
    const question = this.questionRepository.findOneBy({ questionId });
    return this.questionRepository.merge(await question, updateQuestionInput);
  }

  async remove(questionId: number): Promise<void> {
    const question = this.questionRepository.findOneBy({ questionId });
    if (!question) {
      throw new Error("CAN'T FIND THE QUENSTION!");
    }
    await this.questionRepository.delete({ questionId });
  }

  validQuestionById(questionId: number) {
    try {
      this.questionRepository.findOneBy({ questionId });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'message',
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: error,
        },
      );
    }
    return this.questionRepository.findOneBy({ questionId });
  }

  async createPickedQuestion(questionId: number, responseId: number) {
    const input = this.createPickQuestionInput(questionId);
    const pickedQuestion = this.pickedQuestionRepository.create(await input);
    pickedQuestion.question = await this.entityManager.findOneById(
      Question,
      questionId,
    );
    pickedQuestion.response = await this.entityManager.findOneById(
      Response,
      responseId,
    );
  }

  async createPickQuestionInput(questionId: number) {
    const pickedQuestionInput = new CreatePickedQuestionInput();
    const question = this.findOne(questionId);
    pickedQuestionInput.pickedQuesionContent = (await question).questionContent;
    pickedQuestionInput.pickedQuestionNumber = (await question).questionNumber;

    return pickedQuestionInput;
  }
}
