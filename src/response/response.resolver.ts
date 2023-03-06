/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResponseService } from './response.service';
import { Response } from './entities/response.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { UpdateResponseInput } from './dto/update-response.input';

@Resolver(() => Response)
export class ResponseResolver {
  constructor(private readonly responseService: ResponseService) { }

  @Mutation(() => Response)
  createResponse(
    @Args('input') input: CreateResponseInput,
  ) {
    return this.responseService.create(input);
  }

  @Query(() => [Response])
  findAllResponses() {
    return this.responseService.findAll();
  }

  @Query(() => Response)
  findResponse(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.findOne(responseId);
  }

  @Mutation(() => Response)
  removeResponse(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.remove(responseId);
  }

  @Query(() => Response)
  findResponseWithQueryBuilder(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.getResponseData(responseId);
  }

  @Query(() => [Response])
  findOneResponseDetail(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.findDetail(responseId);
  }

  @Query(() => Response)
  getSumScore(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.getSumScore(responseId);
  }

  @Mutation(() => Response)
  updateResponse(
    @Args('input') input: UpdateResponseInput,
  ) {
    return this.responseService.updateSubmit(
      input
    );
  }
}
