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
import { PickedAnswer } from '../../answer/entities/pickedAnswer.entity';
import { Participant } from '../../participant/entities/participant.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
@Entity()
export class Response {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  responseId: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isSubmit: boolean;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => Participant, (participant) => participant.responses, {
    nullable: false,
  })
  participant: Participant;

  @ManyToOne(() => Survey, (survey) => survey.responses, { nullable: false })
  survey: Survey;

  @OneToMany(() => PickedAnswer, (pickedAnswer) => pickedAnswer.response)
  pickedAnswers: PickedAnswer[];
}
