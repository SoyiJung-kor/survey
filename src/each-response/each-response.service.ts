
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Response } from '../response/entities/response.entity';
import { CreateEachResponseInput } from './dto/create-each-response.input';
import { UpdateEachResponseInput } from './dto/update-each-response.input';
import { EachResponse } from './entities/each-response.entity';
import { EachResponseRepository } from './repositories/each-response.repository';

@Injectable()
export class EachResponseService {
  constructor(
    @InjectRepository(EachResponse)
    private readonly eachResponseRepository: EachResponseRepository,
    private entityManager: EntityManager,
  ) { }

  private readonly logger = new Logger(EachResponseService.name);

  async create(input: CreateEachResponseInput) {
    const eachResponse = this.eachResponseRepository.create(input);
    eachResponse.response = await this.createResponse(input.responseId);
    return this.entityManager.save(eachResponse);
  }

  async createResponse(id: number) {
    const response = new Response();
    response.id = id;
    return response;
  }

  findAll() {
    return this.eachResponseRepository.find();
  }

  findOne(id: number) {
    return this.validEachResponse(id);

  }

  /**
   * @description 응답의 상세 응답 조회
   * @param responseId 응답아이디
   * @returns [EachResponse]
   */
  async findEachResponseWithResponse(responseId: number) {
    return this.eachResponseRepository.findBy({ responseId: responseId });
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
      throw new Error(`CAN'T FIND THE RESPONSE! ID:${responseId}`);
    }
    return response;
  }

  async remove(id: number) {
    const eachResponse = await this.validEachResponse(id);
    this.eachResponseRepository.delete(id);
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
