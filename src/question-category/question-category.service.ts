
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Question } from '../question/entities/question.entity';
import { CreateQuestionCategoryInput } from './dto/create-question-category.input';
import { UpdateQuestionCategoryInput } from './dto/update-question-category.input';
import { QuestionCategory } from './entities/question-category.entity';
import { QuestionCategoryRepository } from './repositories/question-category.repository';

@Injectable()
export class QuestionCategoryService {
  constructor(
    @InjectRepository(QuestionCategory)
    private readonly questionCategoryRepository: QuestionCategoryRepository,
    private entityManager: EntityManager,
  ) { }

  private readonly logger = new Logger(QuestionCategory.name);

  async create(input: CreateQuestionCategoryInput) {
    const newQuestionCategory = this.questionCategoryRepository.create(input);
    newQuestionCategory.question = await this.createQuestion(input.questionId);
    return this.entityManager.save(newQuestionCategory);
  }

  async createQuestion(id: number) {
    const question = new Question();
    question.id = id;
    return question;
  }

  findAll() {
    return this.questionCategoryRepository.find();
  }

  findOne(id: number) {
    return this.validQuestionCategory(id);
  }

  findQustionCategoryWithQuestion(questionId: number) {
    return this.questionCategoryRepository.findBy({ questionId: questionId });
  }

  async update(input: UpdateQuestionCategoryInput) {
    const questionCategory = await this.validQuestionCategory(input.id);
    if (input?.questionId) {
      const question = await this.validQuestion(input.questionId);
      questionCategory.question = question;
    }
    const result = this.questionCategoryRepository.merge(
      questionCategory,
      input,
    );
    this.questionCategoryRepository.update(input.id, questionCategory);
    return result;
  }

  async remove(id: number) {
    const questionCategory = await this.validQuestionCategory(id);
    this.questionCategoryRepository.delete(id);
    return questionCategory;
  }

  validQuestionCategory(id: number) {
    const questionCategory = this.questionCategoryRepository.findOneBy({ id });
    if (!questionCategory) {
      throw new Error(`CAT NOT FOUND QUESTION CATEGIRY! ID:${id}`);
    }
    return questionCategory;

  }

  async validQuestion(questionId: number) {
    const question = await this.entityManager.findOneBy(Question, { id: questionId });
    if (!question) {
      throw new Error(`CAT NOT FOUND QUESTION! ID:${questionId}`);
    }
    return question;

  }
}
