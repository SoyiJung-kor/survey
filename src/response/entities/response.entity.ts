import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entity/\bcommon.entity';
import { EachResponse } from '../../each-response/entities/each-response.entity';
import { Participant } from '../../participant/entities/participant.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
@Entity()
export class Response extends CommonEntity {
  @Field(() => Boolean)
  @Column({ default: false })
  isSubmit: boolean;

  @Field(() => Int)
  @Column({ default: 0 })
  sumScore: number;

  @Column()
  participantId: number;

  @Column()
  surveyId: number;

  @ManyToOne(() => Participant, (participant) => participant.responses, {
    onDelete: 'CASCADE',
  })
  @Field(() => Participant)
  @JoinColumn({ name: 'participantId' })
  participant: Participant;

  @ManyToOne(() => Survey, (survey) => survey.response, {
    onDelete: 'CASCADE',
  })
  @Field(() => Survey)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @OneToMany(() => EachResponse, (eachresponse) => eachresponse.response, {
    cascade: true,
  })
  eachResponse: EachResponse[];
}
