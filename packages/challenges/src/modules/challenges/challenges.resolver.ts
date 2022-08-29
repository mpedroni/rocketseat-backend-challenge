import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { Status } from 'src/@domain/entities/submission';
import { ChallengeNotFoundError } from 'src/@domain/usecases/errors/challenge-not-found.error';
import { InvalidCodeRepositoryError } from 'src/@domain/usecases/errors/invalid-code-repository.error';
import { ChallengeService } from './challenges.service';
import { CreateChallengeInput } from './dto/create-challenge.input';
import { ListChallengesArgs } from './dto/list-challenges.args';
import { ListChallengesOutput } from './dto/list-challenges.output';
import { SubmitChallengeInput } from './dto/submit-challenge.input';
import { UpdateChallengeInput } from './dto/update-challenge.input';
import { Challenge } from './models/challenge.model';
import { Status as StatusModel, Submission } from './models/submission.model';

function handleError(error: Error) {
  if (
    error instanceof ChallengeNotFoundError ||
    error instanceof InvalidCodeRepositoryError
  ) {
    throw new UserInputError(error.message);
  }
  throw error;
}

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
      handleError(error);
    }
  }

  @Mutation((returns) => Challenge)
  async updateChallenge(
    @Args('id') id: string,
    @Args('updateChallengeInput') updateChallengeInput: UpdateChallengeInput,
  ): Promise<Challenge> {
    try {
      const challenge = await this.challengeService.update({
        id,
        ...updateChallengeInput,
      });
      return challenge;
    } catch (error) {
      handleError(error);
    }
  }

  @Mutation((returns) => Submission)
  async submitChallenge(
    @Args('submitChallengeInput') submitChallengeInput: SubmitChallengeInput,
  ): Promise<Submission> {
    try {
      const { challengeId, repositoryUrl } = submitChallengeInput;

      const { challenge_id, createdAt, id, repository_url, status, grade } =
        await this.challengeService.submit({
          challenge_id: challengeId,
          repository_url: repositoryUrl,
        });
      const challenge = await this.challengeService.retrieve(challenge_id);

      const translatedStatus: Record<Status, StatusModel> = {
        Pending: StatusModel.Pending,
        Error: StatusModel.Error,
        Done: StatusModel.Done,
      };

      return {
        id,
        challenge: {
          createdAt: challenge.createdAt,
          description: challenge.description,
          id: challenge.id,
          title: challenge.title,
        },
        status: translatedStatus[status],
        createdAt,
        challenge_id,
        grade,
        repository_url,
      };
    } catch (error) {
      handleError(error);
    }
  }
}
