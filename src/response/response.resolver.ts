import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ResponseService } from "./response.service";
import { Response } from "./entities/response.entity";
import { CreateResponseInput } from "./dto/create-response.input";

@Resolver(() => Response)
export class ResponseResolver {
  constructor(private readonly responseService: ResponseService) {}

  @Mutation(() => Response)
  createResponse(
    @Args("createResponseInput") createResponseInput: CreateResponseInput
  ) {
    return this.responseService.create(createResponseInput);
  }

  @Query(() => [Response], { name: "findAllResponses" })
  findAll() {
    return this.responseService.findAll();
  }

  @Query(() => Response, { name: "findResponse" })
  findOne(@Args("responseId", { type: () => Int }) responseId: number) {
    return this.responseService.findOne(responseId);
  }

  @Mutation(() => Response)
  removeResponse(@Args("responseId", { type: () => Int }) responseId: number) {
    return this.responseService.remove(responseId);
  }

  @Query(() => Response, { name: "findResponseWithQueryBuilder" })
  find(@Args("responseId", { type: () => Int }) responseId: number) {
    return this.responseService.getResponseData(responseId);
  }

  // @Query(() => Response, { name: "testScore" })
  // findScore(@Args("responseId", { type: () => Int }) responseId: number) {
  //   return this.responseService.getScore(responseId);
  // }

  @Query(() => Response, { name: "getSumScore" })
  getScore(@Args("responseId", { type: () => Int }) responseId: number) {
    return this.responseService.getSumScore(responseId);
  }
}
