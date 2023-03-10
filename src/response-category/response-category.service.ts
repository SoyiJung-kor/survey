
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
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
import { ResponseCategoryRepository } from './repositories/response-category.repository';

@Injectable()
export class ResponseCategoryService {
  constructor(
    @InjectRepository(ResponseCategory)
    private readonly responseCategoryRepository: ResponseCategoryRepository,
    private entityManager: EntityManager,
  ) { }

  async create(input: CreateResponseCategoryInput) {
    await this.validSurvey(input.surveyId);
    const response = await this.validResponse(input.responseId);
    const categories = await this.validCategoryWithSurvey(input.surveyId);
    const categoryResponse = new Array<ResponseCategory>();
    categories.forEach(async category => {
      this.pushCategoryResponse(input, categoryResponse, category, response);
    });
    return this.responseCategoryRepository.save(categoryResponse);
  }

  async pushCategoryResponse(input: CreateResponseCategoryInput, categoryResponse: ResponseCategory[], category: Category, response: Response) {
    const responseCategory = this.responseCategoryRepository.create(input);
    categoryResponse.push(this.bindCategory(responseCategory, category, response));
  }

  bindCategory(responseCategory: ResponseCategory, category: Category, response: Response) {
    responseCategory.categoryName = category.categoryName;
    responseCategory.sumCategoryScore = 0;
    responseCategory.response = response;
    return responseCategory;
  }

  findAll() {
    return this.responseCategoryRepository.find();
  }

  findOne(id: number) {
    return this.validResponseCategory(id);
  }


  /**
   * 질문의 카테고리별 점수를 계산한다.
   * @param input -UpdateResponseCategoryInput
   * @returns ResponseCategory[]
   */
  async sumCategoryScore(input: UpdateResponseCategoryInput) {
    await this.validResponse(input.responseId);
    await this.validSurvey(input.surveyId);
    const eachResponses = await this.findEachResponseWithResponseId(input.responseId);
    const questions = await this.getQuestionWithSurveyId(input.surveyId);


    /**
     * @type {Map<questionContent, questionId>} -질문 제목 목록
     * @property {string} questionContent -질문제목
     * @property {int} questionId -질문아이디
    */
    const questionContents = new Map();
    questions.map(question => {
      questionContents.set(question.questionContent, question)
    })

    /**
     * @type {Map<categoryName, totalScore>} 
     * @property {EachResponse[]} eachResponses 세부 응답 목록
     * @property {string} questionContents 질문 제목 목록
     * */
    const responseCategoryMap = this.setScore(eachResponses, questionContents);

    const responseCategory = await this.entityManager.createQueryBuilder(ResponseCategory, 'responseCategory')
      .where(`responseCategory.responseId = ${input.responseId}`)
      .getMany();

    this.updateScoreAtResponse(responseCategory, responseCategoryMap);
    return this.compareScore(input.responseId, input.surveyId);
  }

  async updateScoreAtResponse(responseCategory: ResponseCategory[], responseCategoryMap: any) {
    responseCategory.map(responseCategory => {
      this.responseCategoryRepository.updateScore(responseCategory, responseCategoryMap);
    });
    return responseCategory;
  }

  /**
   * 세부 응답의 점수를 각 항목의 점수에 더한다.
   * @param eachResponses -세부 응답 목록
   * @param questionContents -질문 제목 목록
   * @returns responseCategoryMap
   */
  async setScore(eachResponses: EachResponse[], questionContents: any) {
    const responseCategoryMap = new Map();
    this.setScoreWithEachResponse(eachResponses, questionContents, responseCategoryMap);
    return responseCategoryMap;
  }

  async setScoreWithEachResponse(eachResponses: EachResponse[], questionContents: any, responseCategoryMap: any) {
    eachResponses.map(async eachResponse => {
      const question = questionContents.get(eachResponse.responseQuestion);
      this.findCategoryAndSetScore(question, responseCategoryMap, eachResponse);
    })
  }

  async findCategoryAndSetScore(question: Question, responseCategoryMap: any, eachResponse: EachResponse) {
    const questionCategories = await this.getCategoryName(question);

    questionCategories.map(data => {
      this.addCategoryScore(responseCategoryMap, data, eachResponse);
    });
  }

  async getCategoryName(question: Question) {
    return await this.entityManager.createQueryBuilder(QuestionCategory, 'question_category')
      .select(`question_category.categoryName`)
      .where(
        `question_category.questionId = ${question.id}`
      )
      .getMany();
  }

  async addCategoryScore(responseCategoryMap: any, data: QuestionCategory, eachResponse: EachResponse) {
    if (responseCategoryMap.has(data.categoryName)) {
      responseCategoryMap.set(data.categoryName, responseCategoryMap.get(data.categoryName) + eachResponse.responseScore)
    } else {
      responseCategoryMap.set(data.categoryName, eachResponse.responseScore)
    }
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
    const category = await this.entityManager.find(Category, { where: { surveyId: surveyId } });

    /**
    * @type {Map<categoryName, categoryId>}
    * @property {string} categoryName -key
    * @property {int} categoryId -value
    */
    const categories = new Map();
    category.map(category => {
      categories.set(category.categoryName, category.id)
    });

    const responseCategoryResultArray = new Array<ResponseCategory>();

    const responseCategoryResult = await this.responseCategoryRepository.findBy({ responseId });

    this.setResponseCategoryResult(responseCategoryResult, categories, responseCategoryResultArray);
    this.responseCategoryRepository.save(responseCategoryResultArray);
    return responseCategoryResult;
  }

  async setResponseCategoryResult(responseCategoryResult: ResponseCategory[], categories: any, responseCategoryResultArray: ResponseCategory[]) {
    responseCategoryResult.map(async result => {
      const categoryScore = await this.getCategory(categories, result);

      (categoryScore).map(score => {
        this.setMessage(score, result, responseCategoryResultArray);
      })
    });
  }

  async getCategory(categories: any, result: ResponseCategory) {
    const categoryId = categories.get(result.categoryName);
    return await this.entityManager.find(CategoryScore, { where: { categoryId: categoryId } });
  }

  setMessage(score: CategoryScore, result: ResponseCategory, responseCategoryResultArray: ResponseCategory[]) {
    if (score.highScore > result.sumCategoryScore && score.lowScore <= result.sumCategoryScore) {
      result.message = score.categoryMessage;
      responseCategoryResultArray.push(result);
    }
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
