import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ValidationEntity } from '../../common/entity/ValidationEntity';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
export class Participant extends ValidationEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  @IsEmail()
  email: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @OneToMany(() => Response, (responses) => responses.participant, {
    cascade: true,
  })
  responses: Response[];
}
