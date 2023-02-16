import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { PickedQuestion } from '../pickedQuestion/entities/pickedQuestion.entity';
import { PickedQuestionService } from './pickedQuestion.service';

@Resolver(() => PickedQuestion)
export class PickedQuestionResolver {
  constructor(private readonly pickedQuestionService: PickedQuestionService) {}
  @Mutation(() => PickedQuestion)
  createPickedQuestion(
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('responseId', { type: () => Int }) responseId: number,
  ) {
    return this.pickedQuestionService.createPickedQuestion(
      questionId,
      responseId,
    );
  }
}
