import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from '../../participant/entities/participant.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
@Entity()
export class Response {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  responseId: number;

  @Field(() => String)
  @Column()
  surveyTitle: string;

  @Field(() => Int)
  @Column()
  questionNumber: number;

  @Field(() => String)
  @Column()
  questionContent: string;

  @Field(() => Int)
  @Column()
  answerNumber: number;

  @Field(() => String)
  @Column()
  answerContent: string;

  @Field(() => Int)
  @Column()
  answerScore: number;

  @Field(() => GraphQLTimestamp)
  @Column()
  createdAt: Date;

  @Field(() => GraphQLTimestamp)
  @Column()
  modifiedAt: Date;

  @ManyToOne(() => Participant, (participant) => participant.responses)
  participant: Participant;

  @ManyToOne(() => Survey, (survey) => survey.responses)
  survey: Survey;
}
