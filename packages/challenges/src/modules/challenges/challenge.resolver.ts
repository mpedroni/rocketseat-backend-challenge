import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ChallengeService } from './challenge.service';
import { CreateChallengeInput } from './dto/create-challenge.input';
import { Challenge } from './models/challenge.model';

@Resolver((of) => Challenge)
export class ChallengeResolver {
  constructor(private readonly challengeService: ChallengeService) {}

  @Query((returns) => Challenge)
  async challenge(@Args('id') id: string): Promise<void> {
    return;
  }

  @Mutation((returns) => Challenge)
  async addChallenge(
    @Args('createChallengeInput') createChallengeInput: CreateChallengeInput,
  ): Promise<Challenge> {
    const challenge = await this.challengeService.create(createChallengeInput);
    return challenge;
  }
}
