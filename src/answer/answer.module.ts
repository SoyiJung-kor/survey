import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { Answer } from './entities/answer.entity';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [
    {
      provide: getRepositoryToken(Answer),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Answer)
      }
    },
    AnswerResolver, AnswerService],
})
export class AnswerModule { }
