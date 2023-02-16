import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const newParticipant = this.participantRepository.create(
      createParticipantInput,
    );
    return this.participantRepository.save(newParticipant);
  }

  findAll() {
    return this.participantRepository.find();
  }

  findOne(participantId: number) {
    this.validParticipantById(participantId);
    return this.participantRepository.findOneBy({ participantId });
  }

  async update(
    participantId: number,
    updateParticipantInput: UpdateParticipantInput,
  ) {
    const participant = this.validParticipantById(participantId);
    this.participantRepository.merge(await participant, updateParticipantInput);
    return this.participantRepository.save(await participant);
  }

  async remove(participantId: number): Promise<void> {
    const participant = this.findOne(participantId);
    if (!participant) {
      throw new Error("CAN'T FIND THE PARTICIPANT!");
    }
    await this.participantRepository.delete({ participantId });
  }

  validParticipantById(participantId: number) {
    try {
      this.participantRepository.findOneBy({ participantId });
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
    return this.participantRepository.findOneBy({ participantId });
  }
}
