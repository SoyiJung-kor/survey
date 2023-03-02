import { Injectable } from '@nestjs/common';
import { CreateCategoryScoreInput } from './dto/create-category-score.input';
import { UpdateCategoryScoreInput } from './dto/update-category-score.input';

@Injectable()
export class CategoryScoreService {
  create(createCategoryScoreInput: CreateCategoryScoreInput) {
    return 'This action adds a new categoryScore';
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
