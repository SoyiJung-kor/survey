import { Injectable } from '@nestjs/common';
import { CreateParticipantInput } from './dto/create-participant.input';
import { UpdateParticipantInput } from './dto/update-participant.input';

@Injectable()
export class ParticipantService {
  create(createParticipantInput: CreateParticipantInput) {
    return 'This action adds a new participant';
  }

  findAll() {
    return `This action returns all participant`;
  }

  findOne(participantId: number) {
    return `This action returns a #${participantId} participant`;
  }

  update(participantId: number, updateParticipantInput: UpdateParticipantInput) {
    return `This action updates a #${participantId} participant`;
  }

  remove(participantId: number) {
    return `This action removes a #${participantId} participant`;
  }
}
