import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Survey } from '../survey/entities/survey.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

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
}
