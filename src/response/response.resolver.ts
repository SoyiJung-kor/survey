
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

  @Query(() => [Response])
  findOneResponseDetail(@Args('responseId', { type: () => Int }) responseId: number) {
    return this.responseService.findDetail(responseId);
  }

  /**
   * @description 참가자 아이디로 응답 조회
   * @param participantId 참가자 아이디 
   * @returns [Response]
   */
  @Query(() => [Response])
  findResponseWithParticipant(@Args('participantId', { type: () => Int }) participantId: number) {
    return this.responseService.findResponseWithParticipant(participantId);
  }

  /**
   * @description 설문 아이디로 응답 조회
   * @param surveyId 설문 아이디 
   * @returns [Response]
   */
  @Query(() => [Response])
  findResponseWithSurvey(@Args('surveytId', { type: () => Int }) surveyId: number) {
    return this.responseService.findResponseWithSurvey(surveyId);
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
