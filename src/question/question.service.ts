
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { QuestionCategory } from '../question-category/entities/question-category.entity';
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
  ) { }

  private readonly logger = new Logger(QuestionService.name);

  async create(input: CreateQuestionInput) {
    const question = this.questionRepository.create(input);
    question.survey = await this.createSurvey(input.surveyId);
    return this.entityManager.save(question);
  }

  async createSurvey(id: number) {
    const survey = new Survey();
    survey.id = id;
    return survey;
  }

  findAll() {
    return this.questionRepository.find();
  }

  findOne(id: number) {
    return this.validQuestion(id);
  }

  /**
   * @description "선택한 질문의 답지 조회"
   * @param id
   * @returns
   */
  async findDetail(id: number) {
    const result = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answers', 'answer')
      .innerJoinAndSelect('question.survey', 'survey')
      .where(`question.id = ${id}`)
      .getOne();
    this.logger.debug(result);
    return result;
  }

  /**
   * @description 항목에 어떤 문항이 포함되어 있는지 조회
   * @param id 설문아이디
   */
  async findQuestionContainCategory(
    surveyId: number,
    categoryName: string,
  ) {
    const question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.questionCategories', 'question_category')
      .where(`question_category.categoryName = '${categoryName}'`)
      .andWhere(`question.surveyId = ${surveyId}`)
      .getMany();

    this.logger.debug(question);
    return question;
  }

  /**
   * @description 질문이 포함하는 항목 조회
   * @param id question id
   * @returns 
   */
  async findQuestionWithCategory(id: number) {
    const result = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.questionCategories', 'question_category')
      .where(`question.id = ${id}`)
      .getOne();

    return result;
  }

  async update(input: UpdateQuestionInput) {
    const question = await this.validQuestion(input.id);
    this.questionRepository.merge(question, input);
    this.questionRepository.update(input.id, question);
    return question;
  }

  async validSurvey(surveyId: number) {
    try {
      const survey = await this.entityManager.findOneBy(Survey, { id: surveyId });

      return survey;
    } catch (error) {
      throw new HttpException(
        {
          message: `SQL ERROR`,
          error: error.sqlMessage,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async remove(id: number) {
    const question = await this.validQuestion(id);
    this.questionRepository.delete({ id });
    return question;
  }

  async validQuestion(id: number) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new Error(`CAN NOT FIND QUESTION! ID: ${id}`);
    }
    return question;
  }

  async copyQuestion(id: number) {
    const question = await this.validQuestion(id);
    const newQuestion = new Question();
    newQuestion.questionNumber = question.questionNumber;
    newQuestion.questionContent = question.questionContent;
    newQuestion.surveyId = question.surveyId;
    question.survey = await this.entityManager.findOneBy(
      Survey,
      { id: question.surveyId },
    );
    const finalQuestion = await this.entityManager.save(newQuestion);

    this.copyAnswer(id, finalQuestion);
    this.copyQuestionCategory(id, finalQuestion);
    return finalQuestion;
  }

  async copyAnswer(id: number, finalQuestion: Question) {
    const answers = await this.entityManager
      .findBy(Answer, { questionId: id });
    answers.forEach(answer => {
      const newAnswer = new Answer();
      newAnswer.answerContent = answer.answerContent;
      newAnswer.answerNumber = answer.answerNumber;
      newAnswer.answerScore = answer.answerScore;
      newAnswer.questionId = finalQuestion.id;
      newAnswer.question = finalQuestion;
      this.entityManager.save(newAnswer);
    });
  }
  async copyQuestionCategory(id: number, finalQuestion: Question) {
    const questionCategories = await this.entityManager
      .findBy(QuestionCategory, { questionId: id });
    questionCategories.forEach(questionCategory => {
      const newQuestionCategory = new QuestionCategory();
      newQuestionCategory.categoryName = questionCategory.categoryName;
      newQuestionCategory.questionId = finalQuestion.id;
      newQuestionCategory.question = finalQuestion;
      this.entityManager.save(newQuestionCategory);
    })
  }
}
