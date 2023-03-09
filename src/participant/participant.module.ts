import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantResolver } from './participant.resolver';
import { Participant } from './entities/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModule } from '../response/response.module';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), ResponseModule],
  providers: [ParticipantResolver, ParticipantService],
})
export class ParticipantModule { }
