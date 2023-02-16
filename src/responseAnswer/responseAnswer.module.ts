import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseAnswer } from './entities/ResponseAnswer.entity';
import { ResponseAnswerResolver } from './ResponseAnswer.resolver';
import { ResponseAnswerService } from './ResponseAnswer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseAnswer])],
  providers: [ResponseAnswerResolver, ResponseAnswerService],
  exports: [TypeOrmModule],
})
export class ResponseAnswerModule {}
