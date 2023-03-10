import { Repository } from "typeorm";
import { Question } from "../entities/question.entity";

export interface QuestionRepository extends Repository<Question> {
    this: Repository<Question>
    findQuestionWithCategory(surveyId: number, categoryName: string): Promise<Question[]>;
    findQuestionWithSurvey(surveyId: number): Promise<Question[]>;
}

type CustomQuestionRepository = Pick<QuestionRepository, 'findQuestionWithCategory' | 'findQuestionWithSurvey'>;

export const CustomQuestionRepositoryMethods: CustomQuestionRepository = {
    /**
   * @description 항목에 어떤 문항이 포함되어 있는지 조회
   * @param surveyId 설문아이디
   * @param categoryName 항목 이름
   * @returns [Question]
   */
    async findQuestionWithCategory(
        surveyId: number,
        categoryName: string,
    ) {
        const question = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.questionCategories', 'question_category')
            .where(`question_category.categoryName = '${categoryName}'`)
            .andWhere(`question.surveyId = ${surveyId}`)
            .getMany();
        return question;
    },

    async findQuestionWithSurvey(surveyId: number) {
        return await this.questionRepository
            .createQueryBuilder('question')
            .innerJoinAndSelect('question.questionCategories', 'questionCategory')
            .where(`question.surveyId = ${surveyId}`)
            .getMany();
    }
}