import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/\bcommon.entity';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
export class EachResponse extends CommonEntity {
  @Field(() => Int)
  @Column()
  responseId: number;

  @Field(() => String)
  @Column()
  responseQuestion: string;

  @Field(() => String)
  @Column()
  responseAnswer: string;

  @Field(() => Int)
  @Column()
  responseScore: number;

  @ManyToOne(() => Response, (response) => response.eachResponse, {
    nullable: false,
  })
  response: Response;
}
