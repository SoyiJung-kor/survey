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
    return `This action returns all categoryScore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryScore`;
  }

  update(id: number, updateCategoryScoreInput: UpdateCategoryScoreInput) {
    return `This action updates a #${id} categoryScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryScore`;
  }
}
