// import { Field, Int, ObjectType } from "@nestjs/graphql";
// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Response } from "../../response/entities/response.entity";
// import { Question } from "../../question/entities/question.entity";

// @Entity()
// @ObjectType()
// export class ResponseQuestion {
//   @Field(() => Int)
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field(() => String)
//   @Column()
//   ResponseQuestionContent: string;

//   @Field(() => Int)
//   ResponseQuestionNumber: number;

//   @Field(() => Int)
//   @Column()
//   questionId: number;

//   @ManyToOne(() => Question, (question) => question.ResponseQuestion)
//   question: Question;

//   @Field(() => Int)
//   @Column()
//   responseId: number;

//   // @ManyToOne(() => Response, (response) => response.responseQuestion)
//   // response: Response;
// }
