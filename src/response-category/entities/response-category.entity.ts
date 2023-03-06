import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/\bcommon.entity';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
export class ResponseCategory extends CommonEntity {
  @Field(() => String)
  @Column()
  categoryName: string;

  @Field(() => Int)
  @Column()
  sumCategoryScore: number;

  @Field(() => String)
  @Column({ default: ' ' })
  message: string;

  @Column()
  responseId: number;

  @ManyToOne(() => Response, (response) => response.responseCategories, {
    onDelete: 'CASCADE',
  })
  @Field(() => Response)
  @JoinColumn({ name: 'responseId' })
  response: Response;
}
