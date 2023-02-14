import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResponseService } from './response.service';
import { Response } from './entities/response.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { UpdateResponseInput } from './dto/update-response.input';

@Resolver(() => Response)
export class ResponseResolver {
  constructor(private readonly responseService: ResponseService) {}

  @Mutation(() => Response)
  createResponse(@Args('createResponseInput') createResponseInput: CreateResponseInput) {
    return this.responseService.create(createResponseInput);
  }

  @Query(() => [Response], { name: 'response' })
  findAll() {
    return this.responseService.findAll();
  }

  @Query(() => Response, { name: 'response' })
  findOne(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.findOne(responseId);
  }

  @Mutation(() => Response)
  updateResponse(@Args('updateResponseInput') updateResponseInput: UpdateResponseInput) {
    return this.responseService.update(updateResponseInput.responseId, updateResponseInput);
  }

  @Mutation(() => Response)
  removeResponse(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.remove(responseId);
  }
}
