import { Module } from '@nestjs/common';
import { QuestionCategoryService } from './question-category.service';
import { QuestionCategoryResolver } from './question-category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionCategory } from './entities/question-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionCategory])],
  providers: [QuestionCategoryResolver, QuestionCategoryService],
})
// eslint-disable-next-line prettier/prettier
export class QuestionCategoryModule { }
