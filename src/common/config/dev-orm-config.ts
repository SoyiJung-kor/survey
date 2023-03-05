/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Answer } from '../../answer/entities/answer.entity';
import { CategoryScore } from '../../category-score/entities/category-score.entity';
import { Category } from '../../category/entities/category.entity';
import { EachResponse } from '../../each-response/entities/each-response.entity';
import { Participant } from '../../participant/entities/participant.entity';
import { QuestionCategory } from '../../question-category/entities/question-category.entity';
import { Question } from '../../question/entities/question.entity';
import { ResponseCategory } from '../../response-category/entities/response-category.entity';
import { Response } from '../../response/entities/response.entity';
import { Survey } from '../../survey/entities/survey.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [Answer, Participant, Question, Response, Survey, EachResponse, Category, CategoryScore, QuestionCategory, ResponseCategory],
    synchronize: true,
};
