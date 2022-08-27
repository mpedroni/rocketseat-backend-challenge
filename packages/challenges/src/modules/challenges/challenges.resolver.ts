import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { ChallengeNotFoundError } from 'src/@domain/usecases/errors/challenge-not-found.error';
import { ChallengeService } from './challenges.service';
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

  @Mutation((returns) => String)
  async removeChallenge(@Args('id') id: string): Promise<string> {
    try {
      await this.challengeService.delete(id);
      return id;
    } catch (error) {
      if (error instanceof ChallengeNotFoundError) {
        throw new UserInputError(error.message);
      }
    }
  }
}
