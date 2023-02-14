import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
export class Participant {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  participantId: number;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => GraphQLTimestamp)
  @Column()
  createdAt: Date;

  @Field(() => GraphQLTimestamp)
  @Column()
  modifiedAt: Date;
  
  @OneToMany(type => Response, responses => responses.participant)
  responses: Response[];

}