/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Response } from '../response/entities/response.entity';
import { CreateEachResponseInput } from './dto/create-each-response.input';
import { UpdateEachResponseInput } from './dto/update-each-response.input';
import { EachResponse } from './entities/each-response.entity';

@Injectable()
export class EachResponseService {
  constructor(
    @InjectRepository(EachResponse)
    private eachResponseRepository: Repository<EachResponse>,
    private entityManager: EntityManager,
  ) { }

  private readonly logger = new Logger(EachResponseService.name);

  async create(input: CreateEachResponseInput) {
    const eachResponse = this.eachResponseRepository.create(input);
    eachResponse.response = await this.entityManager.findOneBy(Response, {
      id: input.responseId,
    });
    return this.entityManager.save(eachResponse);
  }

  findAll() {
    return this.eachResponseRepository.find();
  }

  findOne(id: number) {
    return this.validEachResponse(id);

  }

  async update(input: UpdateEachResponseInput) {
    const eachResponse = await this.validEachResponse(input.id);
    if (input.responseId) {
      const response = await this.validResponse(input.responseId);
      eachResponse.response = response;
    }
    this.eachResponseRepository.merge(
      eachResponse,
      input,
    );
    this.eachResponseRepository.update(input.id, eachResponse);
    return eachResponse;
  }
  async validResponse(responseId: number) {
    const response = await this.entityManager.findOneBy(Response, { id: responseId });
    if (!response) {
      throw new Error("CAN'T FIND THE RESPONSE")
    } else {
      return response;
    }
  }

  async remove(id: number) {
    const eachResponse = await this.validEachResponse(id);
    await this.eachResponseRepository.delete(id);
    return eachResponse;
  }

  async validEachResponse(id: number) {
    const eachResponse = await this.eachResponseRepository.findOneBy({ id });
    if (!eachResponse) {
      throw new Error(`CAN NOT FIND EACHRESPONSE! ID: ${id}`);
    }
    return eachResponse;
  }
}
