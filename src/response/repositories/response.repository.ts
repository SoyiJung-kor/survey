import { Repository } from "typeorm";
import { Response } from "../entities/response.entity";

export interface ResponseRepository extends Repository<Response> {
    this: Repository<Response>
    getScore(id: number);
    getSumScore(id: number, SumScore: number);
}

type CustomResponseRepository = Pick<ResponseRepository, 'getScore' | 'getSumScore'>;

export const CustomResponseRepositoryMethods: CustomResponseRepository = {
    async getScore(id: number) {
        const score = await this.entityManager
            .createQueryBuilder(Response, 'response')
            .leftJoin('response.eachResponse', 'eachResponse')
            .select('SUM(eachResponse.responseScore)', 'totalScore')
            .where(`response.id = ${id}`)
            .getRawOne();

        return score;
    },
    async getSumScore(id: number, SumScore: number) {
        await this.entityManager
            .createQueryBuilder()
            .update(Response)
            .set({ sumScore: `${SumScore}` })
            .where(`id = ${id}`)
            .execute();

        return this.findOne(id);
    }
}