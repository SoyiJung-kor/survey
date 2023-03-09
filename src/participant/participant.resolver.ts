
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParticipantService } from './participant.service';
import { Participant } from './entities/participant.entity';
import { CreateParticipantInput } from './dto/create-participant.input';
import { UpdateParticipantInput } from './dto/update-participant.input';

@Resolver(() => Participant)
export class ParticipantResolver {
  constructor(private readonly participantService: ParticipantService) { }

  @Mutation(() => Participant)
  createParticipant(
    @Args('input')
    input: CreateParticipantInput,
  ) {
    return this.participantService.create(input);
  }

  @Query(() => [Participant])
  findAllParticipants() {
    return this.participantService.findAll();
  }

  @Query(() => Participant)
  findOneParticipant(@Args('participantId', { type: () => Int }) participantId: number) {
    return this.participantService.findOne(participantId);
  }

  @Mutation(() => Participant)
  updateParticipant(
    @Args('input')
    input: UpdateParticipantInput,
  ) {
    return this.participantService.update(
      input,
    );
  }

  @Mutation(() => Participant)
  removeParticipant(@Args('participantId', { type: () => Int }) id: number) {
    return this.participantService.remove(id);
  }
}
