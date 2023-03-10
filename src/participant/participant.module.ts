import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantResolver } from './participant.resolver';
import { Participant } from './entities/participant.entity';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModule } from '../response/response.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), ResponseModule],
  providers: [
    {
      provide: getRepositoryToken(Participant),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Participant)
      }
    }
    , ParticipantResolver, ParticipantService],
})
export class ParticipantModule { }
