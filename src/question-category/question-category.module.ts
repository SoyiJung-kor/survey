import { Module } from '@nestjs/common';
import { QuestionCategoryService } from './question-category.service';
import { QuestionCategoryResolver } from './question-category.resolver';

@Module({
  providers: [QuestionCategoryResolver, QuestionCategoryService]
})
export class QuestionCategoryModule {}
