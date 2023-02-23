import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EachResponse } from '../../each-response/entities/each-response.entity';
import { Participant } from '../../participant/entities/participant.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
@Entity()
export class Response {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isSubmit: boolean;

  @Field(() => Int)
  @Column()
  sumScore: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @Field(() => Int)
  @Column()
  participantId: number;

  @Field(() => Int)
  @Column()
  surveyId: number;

  @ManyToOne(() => Participant, (participant) => participant.responses, {
    nullable: false,
  })
  participant: Participant;

  @ManyToOne(() => Survey, (survey) => survey.response, {
    onDelete: 'CASCADE',
  })
  survey: Survey;

  @OneToMany(() => EachResponse, (eachresponse) => eachresponse.response, {
    cascade: true,
  })
  eachResponse: EachResponse[];
}
