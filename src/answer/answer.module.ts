import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { Answer } from './entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickedAnswerModule } from '../pickedAnswer/pickedAnswer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), PickedAnswerModule],
  providers: [AnswerResolver, AnswerService],
  exports: [TypeOrmModule],
})
export class AnswerModule {}
