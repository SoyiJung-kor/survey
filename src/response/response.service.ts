import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Participant } from '../participant/entities/participant.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { Response } from './entities/response.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    private entityManager: EntityManager,
    private dataSource: DataSource,
  ) {}

  async create(input: CreateResponseInput) {
    const response = this.responseRepository.create(input);
    response.isSubmit = false;
    response.participant = await this.entityManager.findOneById(
      Participant,
      input.participantId,
    );
    return this.responseRepository.save(response);
  }

  findAll() {
    return this.responseRepository.find();
  }

  findOne(responseId: number) {
    this.validResponseId(responseId);
    return this.responseRepository.findOneBy({ responseId });
  }

  async remove(responseId: number): Promise<void> {
    const response = this.responseRepository.findOneBy({ responseId });
    if (!response) {
      throw new Error("CAN'T FIND THE RESPONSE!");
    }
    await this.responseRepository.delete({ responseId });
  }

  validResponseId(responseId: number) {
    try {
      this.responseRepository.findOneBy({ responseId });
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
    return this.responseRepository.findOneBy({ responseId });
  }

  async getResponseData(responseId: number) {
    const responseData = await this.dataSource.manager
      .createQueryBuilder(Response, 'response')
      .where('response.responseId = :id', { id: 1 })
      .getOne();

    return responseData;
  }
}
