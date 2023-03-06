/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    private dataSource: DataSource,
  ) { }
  async create(
    input: CreateResponseCategoryInput,
  ) {
    /**
     * 입력한 응답아이디로
     * survey.id==response.surveyId인 survey를 찾는다.
     * 이 survey에 포함된 category의 이름으로 그 갯수만큼 responseCategory를 만든다.
     */
    await this.validResponse(input.responseId);
    await this.validSurvey(input.surveyId);
    const category = await this.dataSource.manager.findBy(Category, {
      surveyId: input.surveyId,
    });
    for (let i = 0; i < category.length; i++) {
      const responseCategory = this.responseCategoryRepository.create(input);
      responseCategory.categoryName = category[i].categoryName;
      responseCategory.sumCategoryScore = 0;
      responseCategory.response = await this.dataSource.manager.findOneBy(
        Response,
        { id: input.responseId }
      );
      this.responseCategoryRepository.save(responseCategory);
    }
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
    /**
     * 1. question.surveyId==response.surveyId인 question의 id를 찾는다.
     * response의 eachREsponse 갯수만큼 아래를 반복한다.
     *  2. 위 (1)question들 중에서 eachResponse.responseQuestion == question.questionContent인 question을 찾는다.
     *  3. questionCategory.questionId==(2)question.id인 questionCategory들을 찾는다.
     *  검색된 questionCategory의 갯수만큼 아래를 반복한다.
     *    responseCategory.categoryName == questionCategory[i]?
     *      => responseCategory.sumCategoryScore+=eachResponse.score
     *
     */
    await this.validResponse(input.responseId);
    await this.validSurvey(input.surveyId);
    const responseCategories = await this.dataSource.manager.find(
      ResponseCategory,
      {
        where: {
          responseId: input.responseId,
        },
      },
    );
    const questions = this.dataSource.manager.find(Question, {
      where: {
        surveyId: input.surveyId,
      },
    });
    const eachResponses = await this.dataSource.manager.findBy(EachResponse, {
      responseId: input.responseId,
    });
    responseCategories.forEach((resCat) => {
      eachResponses.forEach(async (res) => {
        (await questions).forEach(async (q) => {
          if (q.questionContent == res.responseQuestion) {
            const questionId = q.id;
            const questionCategories = await this.dataSource.manager.findBy(
              QuestionCategory,
              {
                questionId: questionId,
              },
            );
            questionCategories.forEach((queCat) => {
              if (queCat.categoryName == resCat.categoryName) {
                resCat.sumCategoryScore += res.responseScore;
                this.responseCategoryRepository.update(resCat.id, resCat);
              }
            });
          }
        });
      });
    });
    return responseCategories;
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
      categories.push(this.dataSource.manager.findOne(Category, {
        where: {
          surveyId: surveyId,
          categoryName: result.categoryName,
        }
      }))
    });

    for (let i = 0; i < categories.length; i++) {
      const categoryScores = await this.dataSource.manager.find(CategoryScore, {
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
    const response = await this.dataSource.manager.findOneBy(Response, { id: responseId });
    if (!response) {
      throw new Error(`CAN NOT FOUND RESPONSE! id: ${responseId}`)
    }
  }

  async validSurvey(surveyId: number) {
    const survey = await this.dataSource.manager.findOneBy(Survey, { id: surveyId });
    if (!survey) {
      throw new Error(`CAN NOT FOUND SURVEY! id: ${surveyId}`)
    }
  }
}
