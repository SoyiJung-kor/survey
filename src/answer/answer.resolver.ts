import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { PickedAnswer } from './entities/pickedAnswer.entity';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => Answer)
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ) {
    return this.answerService.create(createAnswerInput);
  }

  @Query(() => [Answer], { name: 'findAllAnswers' })
  findAll() {
    return this.answerService.findAll();
  }

  @Query(() => Answer, { name: 'findAnswer' })
  findOne(@Args('answerId', { type: () => Int }) answerId: number) {
    return this.answerService.findOne(answerId);
  }

  @Mutation(() => Answer)
  updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
  ) {
    return this.answerService.update(
      updateAnswerInput.answerId,
      updateAnswerInput,
    );
  }

  @Mutation(() => Answer)
  removeAnswer(@Args('answerId', { type: () => Int }) answerId: number) {
    return this.answerService.remove(answerId);
  }

  @Mutation(() => PickedAnswer)
  createPickedAnswer(
    @Args('answerId', { type: () => Int }) answerId: number,
    @Args('responseId', { type: () => Int }) responseId: number,
  ) {
    return this.answerService.createPickedAnswer(answerId, responseId);
  }
}
