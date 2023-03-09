import { Module } from '@nestjs/common';
import { CategoryScoreService } from './category-score.service';
import { CategoryScoreResolver } from './category-score.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryScore } from './entities/category-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryScore])],
  providers: [CategoryScoreResolver, CategoryScoreService],
})
export class CategoryScoreModule { }
