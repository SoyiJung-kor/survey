import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import { Participant } from "../participant/entities/participant.entity";
import { CreateResponseInput } from "./dto/create-response.input";
import { UpdateResponseInput } from "./dto/update-response.input";
import { Response } from "./entities/response.entity";

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    private entityManager: EntityManager,
    private dataSource: DataSource
  ) {}

  async create(input: CreateResponseInput) {
    const response = this.responseRepository.create(input);
    response.isSubmit = false;
    response.sumScore = 0;
    response.surveyId = input.surveyId;
    response.participant = await this.entityManager.findOneBy(Participant, {
      id: input.participantId,
    });
    return this.responseRepository.save(response);
  }

  findAll() {
    return this.responseRepository.find();
  }

  findOne(id: number) {
    this.validResponseId(id);
    return this.responseRepository.findOneBy({ id });
  }

  async getResponseData(id: number) {
    const responseData = await this.dataSource.manager
      .createQueryBuilder(Response, "response")
      .where(`response.id = ${id}`)
      .getOne();

    return responseData;
  }

  async getScore(id: number) {
    const score = await this.dataSource.manager
      .createQueryBuilder(Response, "response")
      .leftJoin("response.eachResponse", "eachResponse") // leftJoinAndSelect
      .select("SUM(eachResponse.responseScore)", "totalScore")
      .where(`response.id = ${id}`)
      // .getQuery();
      .getRawOne();

    return score;
  }

  async getSumScore(id: number) {
    const Score = await this.getScore(id);
    const SumScore = +Score.totalScore;
    console.log(`Sum Score : ${SumScore}`);
    const result = await this.dataSource.manager
      .createQueryBuilder()
      .update(Response)
      .set({ sumScore: `${SumScore}` })
      .where(`id = ${id}`)
      .execute();

    return result;
  }

  async remove(id: number): Promise<void> {
    const response = this.responseRepository.findOneBy({ id });
    if (!response) {
      throw new Error("CAN'T FIND THE RESPONSE!");
    }
    await this.responseRepository.delete({ id });
  }

  validResponseId(id: number) {
    try {
      this.responseRepository.findOneBy({ id });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: "message",
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: error,
        }
      );
    }
    return this.responseRepository.findOneBy({ id });
  }

  async updateSubmit(id: number, updateResponseInput: UpdateResponseInput) {
    const response = this.responseRepository.findOneBy({ id });
    console.log(`find One By Id : ${response}`);
    this.responseRepository.merge(await response, updateResponseInput);
    return this.responseRepository.update(id, await response);
  }

}
