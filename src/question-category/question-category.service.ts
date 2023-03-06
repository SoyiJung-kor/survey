/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Question } from '../question/entities/question.entity';
import { CreateQuestionCategoryInput } from './dto/create-question-category.input';
import { UpdateQuestionCategoryInput } from './dto/update-question-category.input';
import { QuestionCategory } from './entities/question-category.entity';

@Injectable()
export class QuestionCategoryService {
  constructor(
    @InjectRepository(QuestionCategory)
    private questionCategoryRepository: Repository<QuestionCategory>,
    private entityManager: EntityManager,
    private dataSource: DataSource,
  ) { }

  private readonly logger = new Logger(QuestionCategory.name);

  async create(input: CreateQuestionCategoryInput) {
    const newQuestionCategory = this.questionCategoryRepository.create(input);
    const question = await this.entityManager.findOneBy(Question, {
      id: input.questionId,
    });
    newQuestionCategory.question = question;
    return this.entityManager.save(newQuestionCategory);
  }

  findAll() {
    return this.questionCategoryRepository.find();
  }

  findOne(id: number) {
    return this.validQuestionCategory(id);
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

  remove(id: number) {
    return `This action removes a #${id} questionCategory`;
  }

  validQuestionCategory(id: number) {
    const questionCategory = this.questionCategoryRepository.findOneBy({ id });
    if (!questionCategory) {
      throw new Error(`CAT NOT FOUND QUESTION CATEGIRY! ID:${id}`);
    } else {
      return questionCategory;
    }
  }

  async validQuestion(questionId: number) {
    const question = await this.dataSource.manager.findOneBy(Question, { id: questionId });
    if (!question) {
      throw new Error(`CAT NOT FOUND QUESTION! ID:${questionId}`);
    } else {
      return question;
    }
  }
}
