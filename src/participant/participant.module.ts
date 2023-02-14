import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantResolver } from './participant.resolver';

@Module({
  providers: [ParticipantResolver, ParticipantService]
})
export class ParticipantModule {}
