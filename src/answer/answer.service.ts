import { Injectable } from '@nestjs/common';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Injectable()
export class AnswerService {
  create(createAnswerInput: CreateAnswerInput) {
    return 'This action adds a new answer';
  }

  findAll() {
    return `This action returns all answer`;
  }

  findOne(answerId: number) {
    return `This action returns a #${answerId} answer`;
  }

  update(answerId: number, updateAnswerInput: UpdateAnswerInput) {
    return `This action updates a #${answerId} answer`;
  }

  remove(answerId: number) {
    return `This action removes a #${answerId} answer`;
  }
}
