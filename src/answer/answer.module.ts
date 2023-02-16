import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { Answer } from './entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickedAnswer } from './entities/pickedAnswer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, PickedAnswer])],
  providers: [AnswerResolver, AnswerService],
  exports: [TypeOrmModule],
})
export class AnswerModule {}
