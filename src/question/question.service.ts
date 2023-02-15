import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}
  create(input: CreateQuestionInput) {
    const question = this.questionRepository.create(input);
    return this.questionRepository.save(question);
  }

  findAll() {
    return this.questionRepository.find();
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
