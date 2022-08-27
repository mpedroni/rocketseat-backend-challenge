import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { ChallengeNotFoundError } from 'src/@domain/usecases/errors/challenge-not-found.error';
import { ChallengeService } from './challenges.service';
import { CreateChallengeInput } from './dto/create-challenge.input';
import { ListChallengesArgs } from './dto/list-challenges.args';
import { ListChallengesOutput } from './dto/list-challenges.output';
import { Challenge } from './models/challenge.model';

@Resolver((of) => Challenge)
export class ChallengeResolver {
  constructor(private readonly challengeService: ChallengeService) {}

  @Query((returns) => Challenge)
  async challenge(@Args('id') id: string): Promise<Challenge> {
    try {
      const challenge = await this.challengeService.retrieve(id);
      return challenge;
    } catch (error) {
      if (error instanceof ChallengeNotFoundError) {
        throw new UserInputError(error.message);
      }
    }
  }

  @Query((returns) => ListChallengesOutput)
  async challenges(
    @Args() args: ListChallengesArgs,
  ): Promise<ListChallengesOutput> {
    const { description, title, limit, page } = args;
    const filters = {
      page,
      limit,
      query: {
        description,
        title,
      },
    };
    return await this.challengeService.list(filters);
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
