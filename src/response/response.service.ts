
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Participant } from '../participant/entities/participant.entity';
import { Survey } from '../survey/entities/survey.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { UpdateResponseInput } from './dto/update-response.input';
import { Response } from './entities/response.entity';
import { ResponseRepository } from './repositories/response.repository';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: ResponseRepository,
    private entityManager: EntityManager,
  ) { }

  private readonly logger = new Logger(ResponseService.name);

  async create(input: CreateResponseInput) {
    const response = this.responseRepository.create(input);
    response.survey = await this.createSurvey(input.surveyId);
    response.participant = await this.createParticipant(input.participantId);
    return this.responseRepository.save(response);
  }

  async createSurvey(id: number) {
    const survey = new Survey();
    survey.id = id;
    return survey;
  }

  async createParticipant(id: number) {
    const participant = new Participant();
    participant.id = id;
    return participant;
  }

  findAll() {
    return this.responseRepository.find();
  }

  findOne(id: number) {
    return this.validResponse(id);
  }

  /**
   * @description 참가자의 모든 응답 조회
   * @param participantId 
   */
  async findResponseWithParticipant(participantId: number) {
    return this.responseRepository.findBy({ participantId: participantId });
  }

  /**
   * @description 설문의 모든 응답 조회
   * @param surveyId 
   */
  async findResponseWithSurvey(surveyId: number) {
    return this.responseRepository.findBy({ surveyId: surveyId });
  }

  async getScore(id: number) {
    return await this.responseRepository.getScore(id);
  }

  async getSumScore(id: number) {
    const Score = await this.getScore(id);
    const SumScore = +Score.totalScore;
    await this.responseRepository.getSumScore(id, SumScore)
    return this.findOne(id);
  }

  async remove(id: number) {
    const response = await this.validResponse(id);
    this.responseRepository.delete({ id });
    return response;
  }

  async validResponse(id: number) {
    const response = await this.responseRepository.findOneBy({ id });
    if (!response) {
      throw new Error(`CAN NOT FIND RESPONSE! ID: ${id}`);
    }
    return response;
  }

  async updateSubmit(input: UpdateResponseInput) {
    const response = await this.getSumScore(input.id);
    this.responseRepository.merge(response, input);
    this.responseRepository.update(input.id, response);
    return response;
  }

  async validSurvey(surveyId: number) {
    const survey = await this.entityManager.findOneBy(Survey, { id: surveyId });
    if (!survey) {
      throw new Error(`CAN NOT FOUND SURVEY! ID: ${surveyId} `);
    }
    return survey;
  }
  async validParticipant(participantId: number) {
    const participant = await this.entityManager.findOneBy(Participant, { id: participantId });
    if (!participant) {
      throw new Error(`CAN NOT FOUND PARTICIPANT! ID:${participantId}`);
    }
    return participant;
  }
}
