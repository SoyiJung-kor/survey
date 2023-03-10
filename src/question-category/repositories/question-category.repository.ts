import { Repository } from "typeorm";
import { QuestionCategory } from "../entities/question-category.entity";

export interface QuestionCategoryRepository extends Repository<QuestionCategory> {
    this: Repository<QuestionCategory>
}