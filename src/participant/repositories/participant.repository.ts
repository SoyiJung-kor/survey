import { Repository } from "typeorm"
import { Participant } from "../entities/participant.entity"

export interface ParticipantRepository extends Repository<Participant> {
    this: Repository<Participant>
}