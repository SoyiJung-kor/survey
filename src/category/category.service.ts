/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Survey } from '../survey/entities/survey.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private entityManager: EntityManager,
  ) { }
  private readonly logger = new Logger(CategoryService.name);

  async create(input: CreateCategoryInput) {
    const newCategory = this.categoryRepository.create(input);
    newCategory.survey = await this.entityManager.findOneBy(Survey, { id: input.surveyId },);
    // const survey = new Survey();
    // survey.id = input.surveyId;
    // newCategory.survey = survey;
    return this.entityManager.save(newCategory);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.validCategory(id);
  }

  /**
   * @description "항목이 포함된 설문 조회"
   * @param id 
   * @returns 
   */
  async findSurveyWithCategory(id: number) {
    const result = await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.survey', 'survey')
      .where(`category.id = ${id}`)
      .getOne();

    return result;
  }

  async update(input: UpdateCategoryInput) {
    const category = await this.validCategory(input.id);
    if (input?.surveyId) {
      const survey = await this.validSurvey(input.surveyId);
      category.survey = survey;
    }
    const newCategory = this.categoryRepository.merge(category, input);
    this.categoryRepository.update(input.id, category);
    return newCategory;
  }

  async remove(id: number) {
    const category = await this.validCategory(id);
    await this.categoryRepository.delete(id);
    return category;
  }

  async validCategory(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new Error(`CAN NOT FIND CATEGORY! ID: ${id}`);
    }
    return category;
  }

  async validSurvey(surveyId: number) {
    const survey = await this.entityManager.findOneBy(Survey, { id: surveyId });
    if (!survey) {
      throw new Error(`CAN NOT FIND THE SURVEY! ID: ${surveyId}`);
    } else {
      return survey;
    }
  }
}
