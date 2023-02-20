import { ObjectType, Field, Int } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Question } from "../../question/entities/question.entity";

@Entity()
@ObjectType()
export class Answer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @Field(() => Int)
  @Column()
  answerNumber: number;

  @Field(() => String)
  @Column()
  answerContent: string;

  @Field(() => Int)
  @Column()
  answerScore: number;

  @ManyToOne(() => Question, (question) => question.answers, {
    nullable: false,
  })
  question: Question;

  // @OneToMany(() => ResponseAnswer, (ResponseAnswer) => ResponseAnswer.answer)
  // @JoinTable()
  // ResponseAnswer: ResponseAnswer[];

  @Field(() => Int)
  @Column()
  questionId: number;
  //여기 보기쉽게 바 꿔야해 어떤 방법인진 생각 안남
  // 저 위에 주석 처리 해놓은 jointable 일꺼야
}
