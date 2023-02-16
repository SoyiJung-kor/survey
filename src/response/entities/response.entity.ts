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
import { PickedAnswer } from '../../answer/entities/pickedAnswer.entity';
import { Participant } from '../../participant/entities/participant.entity';
import { PickedSurvey } from '../../survey/entities/pickedSurvey.entity';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => Participant, (participant) => participant.responses, {
    nullable: false,
  })
  participant: Participant;

  @OneToMany(() => PickedAnswer, (pickedAnswer) => pickedAnswer.response)
  @JoinTable()
  pickedAnswers: PickedAnswer[];

  @OneToMany(() => PickedSurvey, (pickedSurvey) => pickedSurvey.response)
  @JoinTable()
  pickedSurvey: PickedSurvey[];
}
