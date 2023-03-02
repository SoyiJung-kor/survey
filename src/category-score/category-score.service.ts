/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { CreateCategoryScoreInput } from './dto/create-category-score.input';
import { UpdateCategoryScoreInput } from './dto/update-category-score.input';
import { CategoryScore } from './entities/category-score.entity';

@Injectable()
export class CategoryScoreService {
  constructor(
    @InjectRepository(CategoryScore)
    private categoryScoreRepository: Repository<CategoryScore>,
    private entityManager: EntityManager,
  ) { }

  private readonly logger = new Logger(CategoryScoreService.name);

  async create(input: CreateCategoryScoreInput) {
    const newCategoryScore = this.categoryScoreRepository.create(input);
    newCategoryScore.category = await this.entityManager.findOneBy(Category, {
      id: input.categoryId,
    });
    return this.entityManager.save(newCategoryScore);
  }

  findAll() {
    return this.categoryScoreRepository.find();
  }

  findOne(id: number) {
    return this.validCategoryScore(id);
  }

  async update(input: UpdateCategoryScoreInput) {
    const categoryScore = await this.validCategoryScore(input.id);
    if (input?.categoryId) {
      const category = await this.validCategory(input.categoryId);
      categoryScore.category = category;
    }
    const newCategoryScore = this.categoryScoreRepository.merge(
      categoryScore,
      input,
    );
    this.categoryScoreRepository.update(input.id, categoryScore);
    return newCategoryScore;
  }

  async remove(id: number) {
    const categoryScore = await this.validCategoryScore(id);
    await this.categoryScoreRepository.delete(id);
    return categoryScore;
  }

  async validCategoryScore(id: number) {
    const categoryScore = await this.categoryScoreRepository.findOneBy({ id });
    if (!categoryScore) {
      throw new Error(`CAN NOT FIND CATEGORY SCORE! ID: ${id}`);
    }
    return categoryScore;
  }

  async validCategory(categoryId: number) {
    const category = await this.entityManager.findOneBy(Category, {
      id: categoryId,
    });
    if (!category) {
      throw new Error(`CAN NOT FIND CATEGORY! ID: ${categoryId}`);
    } else {
      return category;
    }
  }
}
