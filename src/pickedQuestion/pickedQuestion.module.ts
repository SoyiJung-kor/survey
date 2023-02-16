import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from '../question/question.module';
import { PickedQuestion } from './entities/pickedQuestion.entity';
import { PickedQuestionResolver } from './pickedQuestion.resolver';
import { PickedQuestionService } from './pickedQuestion.service';

@Module({
  imports: [QuestionModule, TypeOrmModule.forFeature([PickedQuestion])],
  providers: [PickedQuestionResolver, PickedQuestionService],
  exports: [TypeOrmModule],
})
export class PickedQuestionModule {}
