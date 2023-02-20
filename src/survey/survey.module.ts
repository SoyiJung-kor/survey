import { Module } from "@nestjs/common";
import { SurveyService } from "./survey.service";
import { SurveyResolver } from "./survey.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Survey } from "./entities/survey.entity";
import { DateScalar } from "../common/scalars/date.scalar";
import { QuestionModule } from "../question/question.module";
import { ResponseModule } from "../response/response.module";

@Module({
  imports: [
    QuestionModule,
    ResponseModule,
    // ResponseSurveyModule,
    TypeOrmModule.forFeature([Survey]),
    // TypeOrmModule.forFeature([ResponseSurvey]),
  ],
  providers: [SurveyResolver, SurveyService, DateScalar],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
