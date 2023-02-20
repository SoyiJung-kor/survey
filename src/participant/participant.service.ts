import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CreateParticipantInput } from "./dto/create-participant.input";
import { UpdateParticipantInput } from "./dto/update-participant.input";
import { Participant } from "./entities/participant.entity";

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    private entityManager: EntityManager,
    private dataSource: DataSource
  ) {}

  create(input: CreateParticipantInput) {
    const newParticipant = this.participantRepository.create(input);
    return this.participantRepository.save(newParticipant);
  }

  findAll() {
    return this.participantRepository.find();
  }

  findOne(id: number) {
    this.validParticipantById(id);
    return this.participantRepository.findOneBy({ id });
  }

  async update(id: number, updateParticipantInput: UpdateParticipantInput) {
    const participant = this.validParticipantById(id);
    this.participantRepository.merge(await participant, updateParticipantInput);
    return this.participantRepository.update(id, await participant);
  }

  async remove(id: number): Promise<void> {
    const participant = this.findOne(id);
    if (!participant) {
      throw new Error("CAN'T FIND THE PARTICIPANT!");
    }
    await this.participantRepository.delete({ id });
  }

  validParticipantById(id: number) {
    try {
      this.participantRepository.findOneBy({ id });
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
    return this.participantRepository.findOneBy({ id });
  }

  //   async getEachRsponsebyUserId(id: number) {
  //     await this.dataSource.manager
  //     .createQueryBuilder(Participant, "participant")
  //     .leftJoin("participant.response", "response")
  //     .
  // }
}
