import { Injectable } from '@nestjs/common';
import { CreateResponseCategoryInput } from './dto/create-response-category.input';
import { UpdateResponseCategoryInput } from './dto/update-response-category.input';

@Injectable()
export class ResponseCategoryService {
  create(createResponseCategoryInput: CreateResponseCategoryInput) {
    return 'This action adds a new responseCategory';
  }

  findAll() {
    return `This action returns all responseCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} responseCategory`;
  }

  update(id: number, updateResponseCategoryInput: UpdateResponseCategoryInput) {
    return `This action updates a #${id} responseCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} responseCategory`;
  }
}
