import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
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
  @JoinTable()
  responseAnswers: ResponseAnswer[];

  @OneToMany(() => ResponseSurvey, (responseSurvey) => responseSurvey.response)
  @JoinTable()
  responseSurvey: ResponseSurvey[];

  @OneToMany(
    () => ResponseQuestion,
    (responseQuestions) => responseQuestions.response,
  )
  @JoinTable()
  responseQuestion: ResponseQuestion[];
}
