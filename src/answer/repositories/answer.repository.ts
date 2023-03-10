import { Repository } from "typeorm";
import { Answer } from "../entities/answer.entity";

export interface AnswerRepository extends Repository<Answer> {
    this: Repository<Answer>
}