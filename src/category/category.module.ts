import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryScoreModule } from '../category-score/category-score.module';

@Module({
  imports: [CategoryScoreModule, TypeOrmModule.forFeature([Category])],
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule { }
