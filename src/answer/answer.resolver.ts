/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) { }

  @Mutation(() => Answer)
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ) {
    return this.answerService.create(createAnswerInput);
  }

  @Query(() => [Answer])
  findAllAnswers() {
    return this.answerService.findAll();
  }

  @Query(() => Answer)
  findAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.findOne(id);
  }

  @Query(() => [Answer])
  findOneAnswerDetail(@Args('answerId', { type: () => Int }) answerId: number) {
    return this.answerService.findDetail(answerId);
  }

  @Mutation(() => Answer)
  updateAnswer(
    @Args('input') input: UpdateAnswerInput,
  ) {
    return this.answerService.update(input);
  }

  @Mutation(() => Answer)
  removeAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.remove(id);
  }
}
