import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { QuestionService } from "./question.service";
import { Question } from "./entities/question.entity";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionInput } from "./dto/update-question.input";

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Mutation(() => Question)
  createQuestion(
    @Args("createQuestionInput") createQuestionInput: CreateQuestionInput
  ) {
    return this.questionService.create(createQuestionInput);
  }

  @Query(() => [Question], { name: "findAllQuestions" })
  findAll() {
    return this.questionService.findAll();
  }

  @Query(() => Question, { name: "findQuestion" })
  findOne(@Args("questionId", { type: () => Int }) questionId: number) {
    return this.questionService.findOne(questionId);
  }

  @Mutation(() => Question)
  updateQuestion(
    @Args("updateQuestionInput") updateQuestionInput: UpdateQuestionInput
  ) {
    return this.questionService.update(
      updateQuestionInput.id,
      updateQuestionInput
    );
  }

  @Mutation(() => Boolean)
  removeQuestion(@Args("questionId", { type: () => Int }) questionId: number) {
    this.questionService.remove(questionId);
  }
}
