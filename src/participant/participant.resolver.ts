/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParticipantService } from './participant.service';
import { Participant } from './entities/participant.entity';
import { CreateParticipantInput } from './dto/create-participant.input';
import { UpdateParticipantInput } from './dto/update-participant.input';

@Resolver(() => Participant)
export class ParticipantResolver {
  constructor(private readonly participantService: ParticipantService) { }

  @Mutation(() => Participant, { name: 'createParticipant' })
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

  @Query(() => Participant, { name: 'findOneParticipant' })
  findOne(@Args('participantId', { type: () => Int }) participantId: number) {
    return this.participantService.findOne(participantId);
  }

  @Mutation(() => Participant, { name: 'updateParticipant' })
  updateParticipant(
    @Args('updateParticipantInput')
    updateParticipantInput: UpdateParticipantInput,
  ) {
    return this.participantService.update(
      updateParticipantInput.id,
      updateParticipantInput,
    );
  }

  @Mutation(() => Participant, { name: 'removeParticipant' })
  removeParticipant(@Args('participantId', { type: () => Int }) id: number) {
    return this.participantService.remove(id);
  }
}
