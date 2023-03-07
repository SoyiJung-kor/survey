/* eslint-disable prettier/prettier */
import { Survey } from '../src/survey/entities/survey.entity';

export const mockSurvey = (): Survey => {
    return {
        surveyTitle: 'Mock Survey for Test',
        id: 1,
        questions: [],
        response: [],
        categories: [],
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
    };
};
