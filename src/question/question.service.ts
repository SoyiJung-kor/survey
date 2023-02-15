import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    this.validQuestionById(questionId);
    return this.questionRepository.findOneBy({ questionId });
  }

  update(questionId: number, updateQuestionInput: UpdateQuestionInput) {
    return `This action updates a #${questionId} question`;
  }

  remove(questionId: number) {
    return `This action removes a #${questionId} question`;
  }

  validQuestionById(questionId: number) {
    try {
      this.questionRepository.findOneBy({ questionId });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'message',
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: error,
        },
      );
    }
    return this.questionRepository.findOneBy({ questionId });
  }
}
