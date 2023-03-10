import { Repository } from "typeorm";
import { EachResponse } from "../entities/each-response.entity";

export interface EachResponseRepository extends Repository<EachResponse> {
    this: Repository<EachResponse>
}