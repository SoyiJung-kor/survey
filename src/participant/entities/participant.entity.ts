import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
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

  @OneToMany(() => Response, (responses) => responses.participant)
  responses: Response[];
}
