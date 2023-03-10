import { Repository } from "typeorm";
import { ResponseCategory } from "../entities/response-category.entity";

export interface ResponseCategoryRepository extends Repository<ResponseCategory> {
    this: Repository<ResponseCategory>
    updateScore(responseCategory: ResponseCategory, responseCategoryMap: any);
}

type CustomResponseCategoryRepository = Pick<ResponseCategoryRepository, 'updateScore'>;

export const CustomResponseCategoryRepositoryMethods: CustomResponseCategoryRepository = {
    async updateScore(responseCategory: ResponseCategory, responseCategoryMap: any) {
        this.responseCategoryRepository.createQueryBuilder()
            .update(ResponseCategory)
            .set({ sumCategoryScore: responseCategoryMap.get(responseCategory.categoryName) })
            .where({ id: responseCategory.id })
            .execute();
    }
}