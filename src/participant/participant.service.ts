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

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  update(id: number, updateParticipantInput: UpdateParticipantInput) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
