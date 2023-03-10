import { Module } from '@nestjs/common';
import { CategoryScoreService } from './category-score.service';
import { CategoryScoreResolver } from './category-score.resolver';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CategoryScore } from './entities/category-score.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryScore])],
  providers: [
    {
      provide: getRepositoryToken(CategoryScore),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(CategoryScore)
      }
    },
    CategoryScoreResolver, CategoryScoreService],
})
export class CategoryScoreModule { }
