import { Repository } from "typeorm";
import { CategoryScore } from "../entities/category-score.entity";

export interface CategoryScoreRepository extends Repository<CategoryScore> {
    this: Repository<CategoryScore>
}