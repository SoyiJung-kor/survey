import { Module, Response } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseResolver } from './response.resolver';
import { Participant } from '../participant/entities/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [Participant, TypeOrmModule.forFeature([Response])],
  providers: [ResponseResolver, ResponseService],
  exports: [TypeOrmModule],
})
export class ResponseModule {}
