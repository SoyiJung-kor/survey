import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { Answer } from './entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswerResolver, AnswerService],
  exports: [TypeOrmModule],
})
// eslint-disable-next-line prettier/prettier
export class AnswerModule { }
