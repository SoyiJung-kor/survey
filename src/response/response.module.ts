import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseResolver } from './response.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from './entities/response.entity';
import { EachResponseModule } from '../each-response/each-response.module';
import { ResponseCategoryModule } from '../response-category/response-category.module';

@Module({
  imports: [
    ResponseCategoryModule,
    EachResponseModule,
    TypeOrmModule.forFeature([Response]),
  ],
  providers: [ResponseResolver, ResponseService],
})
// eslint-disable-next-line prettier/prettier
export class ResponseModule { }
