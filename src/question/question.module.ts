import { Module } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionResolver } from "./question.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnswerModule } from "../answer/answer.module";
import { Question } from "./entities/question.entity";

@Module({
  imports: [AnswerModule, TypeOrmModule.forFeature([Question])],
  providers: [QuestionResolver, QuestionService],
  exports: [TypeOrmModule],
})
export class QuestionModule {}
