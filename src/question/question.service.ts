import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Injectable()
export class QuestionService {
  create(createQuestionInput: CreateQuestionInput) {
    return 'This action adds a new question';
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(questionId: number) {
    return `This action returns a #${questionId} question`;
  }

  update(questionId: number, updateQuestionInput: UpdateQuestionInput) {
    return `This action updates a #${questionId} question`;
  }

  remove(questionId: number) {
    return `This action removes a #${questionId} question`;
  }
}
