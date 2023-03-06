import { Module } from '@nestjs/common';
import { ResponseCategoryService } from './response-category.service';
import { ResponseCategoryResolver } from './response-category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseCategory } from './entities/response-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseCategory])],
  providers: [ResponseCategoryResolver, ResponseCategoryService],
})
// eslint-disable-next-line prettier/prettier
export class ResponseCategoryModule { }
