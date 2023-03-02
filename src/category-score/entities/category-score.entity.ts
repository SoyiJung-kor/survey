import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { CommonEntity } from '../../common/entities/\bcommon.entity';

@ObjectType()
@Entity()
export class CategoryScore extends CommonEntity {
  @Field(() => Int)
  @Column()
  @IsNumber()
  highScore: number;

  @Field(() => Int)
  @Column()
  @IsNumber()
  lowScore: number;

  @Field(() => String)
  @Column()
  @IsString()
  @MinLength(2)
  categoryMessage: string;

  @Column()
  categoryId: number;

  @Field(() => Category)
  @JoinColumn({ name: 'categoryId' })
  @ManyToOne(() => Category, (category) => category.categoryScores, {
    onDelete: 'CASCADE',
  })
  category: Category;
}
