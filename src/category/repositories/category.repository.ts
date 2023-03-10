import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";

export interface CategoryRepository extends Repository<Category> {
    this: Repository<Category>
}