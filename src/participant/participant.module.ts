import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantResolver } from './participant.resolver';
import { Participant } from './entities/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  providers: [ParticipantResolver, ParticipantService],
  exports: [TypeOrmModule],
})
export class ParticipantModule {}
