import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParticipantService } from './participant.service';
import { Participant } from './entities/participant.entity';
import { CreateParticipantInput } from './dto/create-participant.input';
import { UpdateParticipantInput } from './dto/update-participant.input';

@Resolver(() => Participant)
export class ParticipantResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @Mutation(() => Participant)
  createParticipant(
    @Args('createParticipantInput')
    createParticipantInput: CreateParticipantInput,
  ) {
    return this.participantService.create(createParticipantInput);
  }

  @Query(() => [Participant], { name: 'findAllParticipants' })
  findAll() {
    return this.participantService.findAll();
  }

  @Query(() => Participant, { name: 'participant' })
  findOne(@Args('participantId', { type: () => Int }) participantId: number) {
    return this.participantService.findOne(participantId);
  }

  @Mutation(() => Participant)
  updateParticipant(
    @Args('updateParticipantInput')
    updateParticipantInput: UpdateParticipantInput,
  ) {
    return this.participantService.update(
      updateParticipantInput.participantId,
      updateParticipantInput,
    );
  }

  @Mutation(() => Participant)
  removeParticipant(
    @Args('participantId', { type: () => Int }) participantId: number,
  ) {
    return this.participantService.remove(participantId);
  }
}
