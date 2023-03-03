import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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
    return `This action returns all questionCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionCategory`;
  }

  update(id: number, updateQuestionCategoryInput: UpdateQuestionCategoryInput) {
    return `This action updates a #${id} questionCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionCategory`;
  }
}
