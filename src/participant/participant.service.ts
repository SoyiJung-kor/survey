/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParticipantInput } from './dto/create-participant.input';
import { UpdateParticipantInput } from './dto/update-participant.input';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) { }

  private readonly logger = new Logger(ParticipantService.name);

  create(input: CreateParticipantInput) {
    const newParticipant = this.participantRepository.create(input);
    return this.participantRepository.save(newParticipant);
  }

  findAll() {
    return this.participantRepository.find();
  }

  findOne(id: number) {
    return this.validParticipant(id);
  }

  async update(input: UpdateParticipantInput) {
    const participant = await this.validParticipant(input.id);
    this.participantRepository.merge(await participant, input);
    this.participantRepository.update(input.id, participant);
    return participant;
  }

  async remove(id: number) {
    const participant = this.participantRepository.findOneBy({ id });
    if (!participant) {
      throw new Error("CAN'T FIND THE PARTICIPANT!");
    }
    await this.participantRepository.delete({ id });
    return participant;
  }

  async validParticipant(id: number) {
    const participant = await this.participantRepository.findOneBy({ id });
    if (!participant) {
      throw new Error(`CAN NOT FIND PARTICIPANT! ID: ${id}`);
    }
    return participant;
  }
}
