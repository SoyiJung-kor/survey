import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entities/\bcommon.entity';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
export class Participant extends CommonEntity {
  @Field(() => String)
  @Column()
  @IsEmail()
  email: string;

  @OneToMany(() => Response, (responses) => responses.participant, {
    cascade: true,
  })
  responses: Response[];
}
