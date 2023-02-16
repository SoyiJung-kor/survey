import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from '../answer/answer.module';
import { ResponseModule } from '../response/response.module';
import { PickedAnswer } from './entities/pickedAnswer.entity';
import { PickedAnswerResolver } from './pickedAnswer.resolver';
import { PickedAnswerService } from './pickedAnswer.service';

@Module({
  imports: [
    AnswerModule,
    TypeOrmModule.forFeature([PickedAnswer]),
    ResponseModule,
  ],
  providers: [PickedAnswerResolver, PickedAnswerService],
  exports: [TypeOrmModule],
})
export class PickedAnswerModule {}
