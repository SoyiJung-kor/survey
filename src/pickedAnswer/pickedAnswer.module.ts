import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickedAnswer } from './entities/pickedAnswer.entity';
import { PickedAnswerResolver } from './pickedAnswer.resolver';
import { PickedAnswerService } from './pickedAnswer.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickedAnswer])],
  providers: [PickedAnswerResolver, PickedAnswerService],
  exports: [TypeOrmModule],
})
export class PickedAnswerModule {}
