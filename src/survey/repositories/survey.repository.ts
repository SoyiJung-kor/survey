import { Repository } from "typeorm";
import { Survey } from "../entities/survey.entity";

export interface SurveyRepository extends Repository<Survey> {
    this: Repository<Survey>
    findSurveyWithQuestion(questionId: number): Promise<Survey>;
    findSurveyWithCategory(categoryName: string): Promise<Survey[]>;
}

type CustomSurveyRepository = Pick<SurveyRepository, 'findSurveyWithQuestion' | 'findSurveyWithCategory'>;

export const CustomSurveyRepositoryMethods: CustomSurveyRepository = {
    async findSurveyWithQuestion(questionId: number) {
        return await this.surveyReposytory
            .createQueryBuilder()
            .innerJoinAndSelect(`survey`, `question.surveyId`)
            .where(`question.id = ${questionId}`)
            .where(`survey.id = question.surveyId`)
            .getOne();
    },

    async findSurveyWithCategory(categoryName: string) {
        return this.surveyReposytory
            .createQueryBuilder()
            .innerJoinAndSelect(`survey.categories`, `category`)
            .where(`category.catogoryName = ${categoryName}`)
            .getMany();
    }
}