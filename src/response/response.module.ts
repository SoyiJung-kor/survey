import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseResolver } from './response.resolver';
import { Participant } from '../participant/entities/participant.entity';

@Module({
  imports: [ Participant],
  providers: [ResponseResolver, ResponseService]
})
export class ResponseModule {}
