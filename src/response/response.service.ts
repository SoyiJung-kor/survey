/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Participant } from '../participant/entities/participant.entity';
import { Survey } from '../survey/entities/survey.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { UpdateResponseInput } from './dto/update-response.input';
import { Response } from './entities/response.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    private entityManager: EntityManager,
    private dataSource: DataSource,
  ) { }

  async create(input: CreateResponseInput) {
    const response = this.responseRepository.create(input);
    response.survey = await this.entityManager.findOneBy(Survey, {
      id: input.surveyId,
    });
    response.participant = await this.entityManager.findOneBy(Participant, {
      id: input.participantId,
    });
    return this.responseRepository.save(response);
  }

  findAll() {
    return this.responseRepository.find();
  }

  findOne(id: number) {
    return this.validResponse(id);
  }

  async findDetail(id: number) {
    const result = await this.responseRepository
      .createQueryBuilder('response')
      .leftJoinAndSelect('response.eachResponse', 'eachResponse')
      .innerJoinAndSelect('response.participant', 'participant')
      .innerJoinAndSelect('response.survey', 'survey')
      .where(`response.id= :${id}`)
      .getMany();

    return result;
  }

  async getResponseData(id: number) {
    const responseData = await this.dataSource.manager
      .createQueryBuilder(Response, 'response')
      .where(`response.id = ${id}`)
      .getOne();

    return responseData;
  }

  async getScore(id: number) {
    const score = await this.dataSource.manager
      .createQueryBuilder(Response, 'response')
      .leftJoin('response.eachResponse', 'eachResponse')
      .select('SUM(eachResponse.responseScore)', 'totalScore')
      .where(`response.id = ${id}`)
      .getRawOne();

    return score;
  }

  async getSumScore(id: number) {
    const Score = await this.getScore(id);
    const SumScore = +Score.totalScore;
    await this.dataSource.manager
      .createQueryBuilder()
      .update(Response)
      .set({ sumScore: `${SumScore}` })
      .where(`id = ${id}`)
      .execute();

    return this.findOne(id);
  }

  async remove(id: number) {
    const response = this.responseRepository.findOneBy({ id });
    if (!response) {
      throw new Error("CAN'T FIND THE RESPONSE!");
    }
    await this.responseRepository.delete({ id });
    return response;
  }

  async validResponse(id: number) {
    const response = await this.responseRepository.findOneBy({ id });
    if (!response) {
      throw new Error(`CAN NOT FIND RESPONSE! ID: ${id}`);
    }
    return response;
  }

  async updateSubmit(id: number, updateResponseInput: UpdateResponseInput) {
    const response = this.validResponse(id);
    this.responseRepository.merge(await response, updateResponseInput);
    this.responseRepository.update(id, await response);
    return response;
  }
}
