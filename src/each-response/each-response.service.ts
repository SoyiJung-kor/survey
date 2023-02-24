/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
    private dataSource: DataSource,
  ) { }

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
    this.validEachResponseById(id);
    return this.eachResponseRepository.findOneBy({ id });
  }

  async update(id: number, updateEachResponseInput: UpdateEachResponseInput) {
    const eachResponse = this.validEachResponseById(id);
    this.eachResponseRepository.merge(
      await eachResponse,
      updateEachResponseInput,
    );
    this.eachResponseRepository.update(id, await eachResponse);
    return eachResponse;
  }

  async remove(id: number): Promise<void> {
    const eachResponse = this.findOne(id);
    if (!eachResponse) {
      throw new Error("CAN'T FIND THE EACH RESPONSE!");
    }
    await this.eachResponseRepository.delete({ id });
  }

  validEachResponseById(id: number) {
    try {
      this.eachResponseRepository.findOneBy({ id });
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
    return this.eachResponseRepository.findOneBy({ id });
  }
}
