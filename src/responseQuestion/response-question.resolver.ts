import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { ResponseQuestion } from './entities/response-question.entity';
import { ResponseQuestionService } from './response-question.service';

@Resolver(() => ResponseQuestion)
export class ResponseQuestionResolver {
  constructor(
    private readonly responseQuestionService: ResponseQuestionService,
  ) {}
  @Mutation(() => ResponseQuestion)
  createResponseQuestion(
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('responseId', { type: () => Int }) responseId: number,
  ) {
    return this.responseQuestionService.createResponseQuestion(
      questionId,
      responseId,
    );
  }
}
