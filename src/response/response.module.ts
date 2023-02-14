import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseResolver } from './response.resolver';

@Module({
  providers: [ResponseResolver, ResponseService]
})
export class ResponseModule {}
