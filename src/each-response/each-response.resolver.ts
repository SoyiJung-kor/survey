import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EachResponseService } from './each-response.service';
import { EachResponse } from './entities/each-response.entity';
import { CreateEachResponseInput } from './dto/create-each-response.input';
import { UpdateEachResponseInput } from './dto/update-each-response.input';

@Resolver(() => EachResponse)
export class EachResponseResolver {
  constructor(private readonly eachResponseService: EachResponseService) { }

  @Mutation(() => EachResponse)
  createEachResponse(
    @Args('input')
    input: CreateEachResponseInput,
  ) {
    return this.eachResponseService.create(input);
  }

  @Query(() => [EachResponse])
  findAllEachResponse() {
    return this.eachResponseService.findAll();
  }

  @Query(() => EachResponse)
  findEachResponse(@Args('id', { type: () => Int }) id: number) {
    return this.eachResponseService.findOne(id);
  }

  @Mutation(() => EachResponse)
  updateEachResponse(
    @Args('input')
    input: UpdateEachResponseInput,
  ) {
    return this.eachResponseService.update(input);
  }

  @Mutation(() => EachResponse)
  removeEachResponse(@Args('id', { type: () => Int }) id: number) {
    return this.eachResponseService.remove(id);
  }
}
