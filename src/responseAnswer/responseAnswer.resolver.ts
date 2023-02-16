import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { ResponseAnswer } from '../ResponseAnswer/entities/ResponseAnswer.entity';
import { ResponseAnswerService } from './ResponseAnswer.service';

@Resolver(() => ResponseAnswer)
export class ResponseAnswerResolver {
  constructor(private readonly ResponseAnswerService: ResponseAnswerService) {}

  @Mutation(() => ResponseAnswer)
  createResponseAnswer(
    @Args('answerId', { type: () => Int }) answerId: number,
    @Args('responseId', { type: () => Int }) responseId: number,
  ) {
    return this.ResponseAnswerService.createResponseAnswer(
      answerId,
      responseId,
    );
  }
}
