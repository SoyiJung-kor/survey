import { Injectable } from '@nestjs/common';
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
  ) {}
  create(createParticipantInput: CreateParticipantInput) {
    return 'This action adds a new participant';
  }

  findAll() {
    return `This action returns all participant`;
  }

  findOne(participantId: number) {
    return `This action returns a #${participantId} participant`;
  }

  update(
    participantId: number,
    updateParticipantInput: UpdateParticipantInput,
  ) {
    return `This action updates a #${participantId} participant`;
  }

  remove(participantId: number) {
    return `This action removes a #${participantId} participant`;
  }
}
