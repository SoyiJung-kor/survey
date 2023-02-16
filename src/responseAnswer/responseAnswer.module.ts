import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from '../answer/answer.module';
import { ResponseModule } from '../response/response.module';
import { ResponseAnswer } from './entities/ResponseAnswer.entity';
import { ResponseAnswerResolver } from './ResponseAnswer.resolver';
import { ResponseAnswerService } from './ResponseAnswer.service';

@Module({
  imports: [
    AnswerModule,
    TypeOrmModule.forFeature([ResponseAnswer]),
    ResponseModule,
  ],
  providers: [ResponseAnswerResolver, ResponseAnswerService],
  exports: [TypeOrmModule],
})
export class ResponseAnswerModule {}
