import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { PickedAnswer } from '../pickedAnswer/entities/pickedAnswer.entity';
import { PickedAnswerService } from './pickedAnswer.service';

@Resolver(() => PickedAnswer)
export class PickedAnswerResolver {
  constructor(private readonly pickedAnswerService: PickedAnswerService) {}

  @Mutation(() => PickedAnswer)
  createPickedAnswer(
    @Args('answerId', { type: () => Int }) answerId: number,
    @Args('responseId', { type: () => Int }) responseId: number,
  ) {
    return this.pickedAnswerService.createPickedAnswer(answerId, responseId);
  }
}
