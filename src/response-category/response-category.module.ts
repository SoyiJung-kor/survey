import { Module } from '@nestjs/common';
import { ResponseCategoryService } from './response-category.service';
import { ResponseCategoryResolver } from './response-category.resolver';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ResponseCategory } from './entities/response-category.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseCategory])],
  providers: [
    {
      provide: getRepositoryToken(ResponseCategory),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(ResponseCategory);
      }
    },
    ResponseCategoryResolver, ResponseCategoryService],
})
export class ResponseCategoryModule { }
