import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseResolver } from './response.resolver';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Response } from './entities/response.entity';
import { EachResponseModule } from '../each-response/each-response.module';
import { ResponseCategoryModule } from '../response-category/response-category.module';
import { DataSource } from 'typeorm';
import { CustomResponseRepositoryMethods } from './repositories/response.repository';

@Module({
  imports: [
    ResponseCategoryModule,
    EachResponseModule,
    TypeOrmModule.forFeature([Response]),
  ],
  providers: [
    {
      provide: getRepositoryToken(Response),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Response)
          .extend(CustomResponseRepositoryMethods);
      }
    },
    ResponseResolver, ResponseService],
})
export class ResponseModule { }
