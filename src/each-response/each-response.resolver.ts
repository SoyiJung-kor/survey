import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EachResponseService } from './each-response.service';
import { EachResponse } from './entities/each-response.entity';
import { CreateEachResponseInput } from './dto/create-each-response.input';
import { UpdateEachResponseInput } from './dto/update-each-response.input';

@Resolver(() => EachResponse)
export class EachResponseResolver {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly eachResponseService: EachResponseService) { }

  @Mutation(() => EachResponse, { name: 'createEachResponse' })
  createEachResponse(
    @Args('createEachResponseInput')
    createEachResponseInput: CreateEachResponseInput,
  ) {
    return this.eachResponseService.create(createEachResponseInput);
  }

  @Query(() => [EachResponse], { name: 'findAllEachResponse' })
  findAll() {
    return this.eachResponseService.findAll();
  }

  @Query(() => EachResponse, { name: 'findOneEachResponse' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.eachResponseService.findOne(id);
  }

  @Mutation(() => EachResponse, { name: 'updateEachResponse' })
  updateEachResponse(
    @Args('updateEachResponseInput')
    updateEachResponseInput: UpdateEachResponseInput,
  ) {
    return this.eachResponseService.update(
      updateEachResponseInput.id,
      updateEachResponseInput,
    );
  }

  @Mutation(() => EachResponse, { name: 'removeEachResponse' })
  removeEachResponse(@Args('id', { type: () => Int }) id: number) {
    return this.eachResponseService.remove(id);
  }
}
