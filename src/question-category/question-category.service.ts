import { Injectable } from '@nestjs/common';
import { CreateQuestionCategoryInput } from './dto/create-question-category.input';
import { UpdateQuestionCategoryInput } from './dto/update-question-category.input';

@Injectable()
export class QuestionCategoryService {
  create(createQuestionCategoryInput: CreateQuestionCategoryInput) {
    return 'This action adds a new questionCategory';
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
