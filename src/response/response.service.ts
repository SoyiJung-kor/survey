import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResponseInput } from './dto/create-response.input';
import { UpdateResponseInput } from './dto/update-response.input';
import { Response } from './entities/response.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
  ) {}
  create(createResponseInput: CreateResponseInput) {
    return 'This action adds a new response';
  }

  findAll() {
    return `This action returns all response`;
  }

  findOne(responseId: number) {
    return `This action returns a #${responseId} response`;
  }

  update(responseId: number, updateResponseInput: UpdateResponseInput) {
    return `This action updates a #${responseId} response`;
  }

  remove(responseId: number) {
    return `This action removes a #${responseId} response`;
  }
}
