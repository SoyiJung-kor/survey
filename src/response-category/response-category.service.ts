/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
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
    await this.validResponse(input.responseId);
    const categories = await this.validCategoryWithSurvey(input.surveyId);
    categories.forEach(async category => {
      const responseCategory = this.responseCategoryRepository.create(input);
      responseCategory.categoryName = category.categoryName;
      responseCategory.sumCategoryScore = 0;
      responseCategory.response = await this.validResponse(input.responseId);
      this.responseCategoryRepository.save(responseCategory);
    });


    return this.responseCategoryRepository.find({
      where: {
        responseId: input.responseId,
      },
    });
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
    const eachResponses = await this.entityManager.find(EachResponse, { where: { responseId: input.responseId } });
    const questions = await this.entityManager.createQueryBuilder(Question, 'question')
      .innerJoinAndSelect('question.questionCategories', 'questionCategory')
      .where(`question.surveyId = ${input.surveyId}`)
      .getMany();

    const questionContents = new Map(); //{questionContent: questionId}
    questions.map(question => {
      questionContents.set(question.questionContent, question.id)
    })

    const responseCategoryMap = new Map(); //{categoryName: total score}
    eachResponses.map(async eachResponse => {
      const questionId = questionContents.get(eachResponse.responseQuestion);
      const questionCategories = await this.entityManager.createQueryBuilder(QuestionCategory, 'question_category')
        .select(`question_category.categoryName`)
        .where(
          `question_category.questionId = ${questionId}`
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
    const responseCategory = this.entityManager.createQueryBuilder(ResponseCategory, 'responseCategory')
      .where(`responseCategory.responseId = ${input.responseId}`)
      .getMany();

    (await responseCategory).map(responseCategory => {
      this.entityManager.createQueryBuilder(ResponseCategory, 'responseCategory')
        .update(ResponseCategory)
        .set({ sumCategoryScore: responseCategoryMap.get(responseCategory.categoryName) })
        .where({ id: responseCategory.id })
        .execute();
    });

    return responseCategory;
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
    } else {
      return responseCategory;
    }
  }

  async compareScore(responseId: number, surveyId: number): Promise<ResponseCategory[]> {
    await this.validResponse(responseId);
    await this.validSurvey(surveyId);
    const responseCategoryResult = await this.responseCategoryRepository.findBy({ responseId });
    const categories = [];
    responseCategoryResult.forEach(result => {
      categories.push(this.entityManager.findOne(Category, {
        where: {
          surveyId: surveyId,
          categoryName: result.categoryName,
        }
      }))
    });

    for (let i = 0; i < categories.length; i++) {
      const categoryScores = await this.entityManager.find(CategoryScore, {
        where: {
          categoryId: categories[i].id
        }
      })
      categoryScores.forEach(score => {
        if (score.highScore > responseCategoryResult[i].sumCategoryScore &&
          score.lowScore <= responseCategoryResult[i].sumCategoryScore) {
          responseCategoryResult[i].message = score.categoryMessage;
          this.responseCategoryRepository.save(responseCategoryResult[i]);
        }
      })
    }
    return await this.responseCategoryRepository.find({
      where: {
        responseId: responseId,
      },
    });
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
    } else {
      return category;
    }
  }


}
