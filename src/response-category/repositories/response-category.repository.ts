import { Repository } from "typeorm";
import { ResponseCategory } from "../entities/response-category.entity";

export interface ResponseCategoryRepository extends Repository<ResponseCategory> {
    this: Repository<ResponseCategory>
}