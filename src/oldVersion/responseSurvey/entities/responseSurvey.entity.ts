// import { Field, Int, ObjectType } from "@nestjs/graphql";
// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Response } from "../../response/entities/response.entity";
// import { Survey } from "../../survey/entities/survey.entity";

// @ObjectType()
// @Entity()
// export class ResponseSurvey {
//   @Field(() => Int)
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field(() => String)
//   @Column()
//   ResponseSurveyTitle: string;

//   @Field(() => Int)
//   @Column()
//   surveyId: number;

//   @ManyToOne(() => Survey, (survey) => survey.responseSurvey)
//   survey: Survey;

//   @Field(() => Int)
//   @Column()
//   responseId: number;

//   // @ManyToOne(() => Response, (response) => response.responseSurvey)
//   // response: Response;
// }
