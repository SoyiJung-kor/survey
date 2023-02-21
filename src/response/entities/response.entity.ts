import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResponseAnswer } from '../../ResponseAnswer/entities/ResponseAnswer.entity';
import { Participant } from '../../participant/entities/participant.entity';
import { ResponseQuestion } from '../../responseQuestion/entities/response-question.entity';
import { ResponseSurvey } from '../../responseSurvey/entities/ResponseSurvey.entity';

@ObjectType()
@Entity()
export class Response {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  responseId: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isSubmit: boolean;

  @Field(() => Int)
  @Column()
  sumScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @Field(() => Int)
  @Column()
  participantId: number;

  @ManyToOne(() => Participant, (participant) => participant.responses, {
    nullable: false,
  })
  participant: Participant;

  @OneToMany(() => ResponseAnswer, (responseAnswer) => responseAnswer.response)
  responseAnswers: ResponseAnswer[];

  @OneToMany(() => ResponseSurvey, (responseSurvey) => responseSurvey.response)
  responseSurvey: ResponseSurvey[];

  @OneToMany(
    () => ResponseQuestion,
    (responseQuestions) => responseQuestions.response,
  )
  responseQuestion: ResponseQuestion[];
}
