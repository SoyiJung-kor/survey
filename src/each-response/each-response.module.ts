import { Module } from "@nestjs/common";
import { EachResponseService } from "./each-response.service";
import { EachResponseResolver } from "./each-response.resolver";
import { EachResponse } from "./entities/each-response.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([EachResponse])],
  providers: [EachResponseResolver, EachResponseService],
  exports: [TypeOrmModule],
})
export class EachResponseModule {}
