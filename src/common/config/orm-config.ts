/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Answer } from '../../answer/entities/answer.entity';
import { Category } from '../../category/entities/category.entity';
import { EachResponse } from '../../each-response/entities/each-response.entity';
import { Participant } from '../../participant/entities/participant.entity';
import { Question } from '../../question/entities/question.entity';
import { Response } from '../../response/entities/response.entity';
import { Survey } from '../../survey/entities/survey.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'test',
    entities: [Answer, Participant, Question, Response, Survey, EachResponse, Category],
    synchronize: true,
};
