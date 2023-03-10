import { Module } from '@nestjs/common';
import { EachResponseService } from './each-response.service';
import { EachResponseResolver } from './each-response.resolver';
import { EachResponse } from './entities/each-response.entity';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EachResponse])],
  providers: [
    {
      provide: getRepositoryToken(EachResponse),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(EachResponse)
      }
    },
    EachResponseResolver, EachResponseService],
})
export class EachResponseModule { }
