import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryScoreModule } from '../category-score/category-score.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [CategoryScoreModule, TypeOrmModule.forFeature([Category])],
  providers: [
    {
      provide: getRepositoryToken(Category),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Category)
      }
    },
    CategoryResolver, CategoryService],
})
export class CategoryModule { }
