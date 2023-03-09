
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CategoryScore } from '../category-score/entities/category-score.entity';
import { Category } from '../category/entities/category.entity';
import { EachResponse } from '../each-response/entities/each-response.entity';
import { QuestionCategory } from '../question-category/entities/question-category.entity';
import { Question } from '../question/entities/question.entity';
import { Response } from '../response/entities/response.entity';
import { Survey } from '../survey/entities/survey.entity';
import { CreateResponseCategoryInput } from './dto/create-response-category.input';
import { UpdateResponseCategoryInput } from './dto/update-response-category.input';
import { ResponseCategory } from './entities/response-category.entity';

@Injectable()
export class ResponseCategoryService {
  constructor(
    @InjectRepository(ResponseCategory)
    private responseCategoryRepository: Repository<ResponseCategory>,
    private entityManager: EntityManager,
  ) { }
  async create(
    input: CreateResponseCategoryInput,
  ) {
    await this.validSurvey(input.surveyId);
    const response = await this.validResponse(input.responseId);
    const categories = await this.validCategoryWithSurvey(input.surveyId);
    const categoryResponse = new Array<ResponseCategory>();
    categories.forEach(async category => {
      const responseCategory = this.responseCategoryRepository.create(input);
      responseCategory.categoryName = category.categoryName;
      responseCategory.sumCategoryScore = 0;
      responseCategory.response = response;
      categoryResponse.push(responseCategory);
    });
    return this.responseCategoryRepository.save(categoryResponse);
  }

  findAll() {
    return this.responseCategoryRepository.find();
  }

  findOne(id: number) {
    return this.validResponseCategory(id);
  }


  async sumCategoryScore(input: UpdateResponseCategoryInput) {
    await this.validResponse(input.responseId);
    await this.validSurvey(input.surveyId);
    const eachResponses = await this.findEachResponseWithResponseId(input.responseId);
    const questions = await this.getQuestionWithSurveyId(input.surveyId);

    const questionContents = new Map(); //{questionContent: questionId}
    questions.map(question => {
      questionContents.set(question.questionContent, question)
    })

    //{categoryName: total score}
    const responseCategoryMap = this.setScore(eachResponses, questionContents);

    const responseCategory = await this.entityManager.createQueryBuilder(ResponseCategory, 'responseCategory')
      .where(`responseCategory.responseId = ${input.responseId}`)
      .getMany();

    return this.updateScoreAtResponse(responseCategory, responseCategoryMap);
  }

  async updateScoreAtResponse(responseCategory: ResponseCategory[], responseCategoryMap: any) {
    responseCategory.map(responseCategory => {
      this.entityManager.createQueryBuilder(ResponseCategory, 'responseCategory')
        .update(ResponseCategory)
        .set({ sumCategoryScore: responseCategoryMap.get(responseCategory.categoryName) })
        .where({ id: responseCategory.id })
        .execute();
    });
    return responseCategory;
  }

  async getQuestionWithSurveyId(surveyId: number) {
    const questions = await this.entityManager.createQueryBuilder(Question, 'question')
      .innerJoinAndSelect('question.questionCategories', 'questionCategory')
      .where(`question.surveyId = ${surveyId}`)
      .getMany();
    return questions;
  }

  async findEachResponseWithResponseId(responseId: number) {
    return await this.entityManager.find(EachResponse, { where: { responseId: responseId } });
  }

  async setScore(eachResponses: EachResponse[], questionContents: any) {
    const responseCategoryMap = new Map();
    eachResponses.map(async eachResponse => {
      const question = questionContents.get(eachResponse.responseQuestion);
      const questionCategories = await this.entityManager.createQueryBuilder(QuestionCategory, 'question_category')
        .select(`question_category.categoryName`)
        .where(
          `question_category.questionId = ${question.id}`
        )
        .getMany();
      questionCategories.map(data => {
        if (responseCategoryMap.has(data.categoryName)) {
          responseCategoryMap.set(data.categoryName, responseCategoryMap.get(data.categoryName) + eachResponse.responseScore)
        } else {
          responseCategoryMap.set(data.categoryName, eachResponse.responseScore)
        }
      })
    })
    return responseCategoryMap;
  }

  async remove(id: number) {
    const responseCategory = await this.validResponseCategory(id);
    this.responseCategoryRepository.delete({ id });
    return responseCategory;
  }

  async validResponseCategory(id: number) {
    const responseCategory = this.responseCategoryRepository.findOneBy({ id });
    if (!responseCategory) {
      throw new Error(`CAN NOT FOUND RESPONSE CATEGORY! ID:${id}`);
    }
    return responseCategory;

  }

  async compareScore(responseId: number, surveyId: number): Promise<ResponseCategory[]> {
    await this.validResponse(responseId);
    await this.validSurvey(surveyId);
    const responseCategoryResult = await this.responseCategoryRepository.findBy({ responseId });
    const category = await this.entityManager.find(Category, { where: { surveyId: surveyId } });
    const categories = new Map(); // {categoryName, categoryId}
    category.forEach(category => {
      categories.set(category.categoryName, category.id)
    });

    const responseCategoryResultArray = new Array<ResponseCategory>();
    responseCategoryResult.forEach(async result => {
      const categoryId = categories.get(result.categoryName);
      const categoryScore = this.entityManager.find(CategoryScore, { where: { categoryId: categoryId } });
      (await categoryScore).map(score => {
        if (score.highScore > result.sumCategoryScore && score.lowScore <= result.sumCategoryScore) {
          result.message = score.categoryMessage;
          responseCategoryResultArray.push(result);
        }
      })
    });
    this.responseCategoryRepository.save(responseCategoryResultArray);
    return responseCategoryResult;
  }

  async validResponse(responseId: number) {
    const response = await this.entityManager.findOneBy(Response, { id: responseId });
    if (!response) {
      throw new Error(`CAN NOT FOUND RESPONSE! id: ${responseId}`)
    }
    return response;
  }

  async validSurvey(surveyId: number) {
    const survey = await this.entityManager.findOneBy(Survey, { id: surveyId });
    if (!survey) {
      throw new Error(`CAN NOT FOUND SURVEY! id: ${surveyId}`)
    }
    return survey;
  }

  async validCategoryWithSurvey(surveyId: number) {
    const category = await this.entityManager.findBy(Category, {
      surveyId: surveyId,
    });
    if (!category) {
      throw new Error(`CAN NOT FIND CATEGORY! SURVEYID: ${surveyId}`);
    }
    return category;

  }


}
