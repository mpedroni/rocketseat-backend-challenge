import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { Status as SubmissionStatus } from 'src/@core/domain/entities/submission';
import { ChallengeNotFoundError } from 'src/@core/application/errors/challenge-not-found.error';
import { InvalidCodeRepositoryError } from 'src/@core/application/errors/invalid-code-repository.error';
import { ListSubmissionsUseCaseInput } from 'src/@core/application/usecases/list-submissions.usecase';
import { ChallengeService } from './challenges.service';
import { CreateChallengeInput } from './dto/create-challenge.input';
import { ListChallengesArgs } from './dto/list-challenges.args';
import { ListChallengesOutput } from './dto/list-challenges.output';
import { ListSubmissionsArgs } from './dto/list-submissions.args';
import { ListSubmissionsOutput } from './dto/list-submissions.output';
import { SubmitChallengeInput } from './dto/submit-challenge.input';
import { UpdateChallengeInput } from './dto/update-challenge.input';
import { Challenge } from './models/challenge.model';
import { Status as StatusModel, Submission } from './models/submission.model';
import {
  domainToGraphQLSubmissionStatus,
  graphQlToDomainSubmissionStatus,
} from './utils/translateSubmissionStatus';

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
      const { challengeId, createdAt, id, repositoryUrl, status, grade } =
        await this.challengeService.submit({
          challengeId: submitChallengeInput.challengeId,
          repositoryUrl: submitChallengeInput.repositoryUrl,
        });
      const challenge = await this.challengeService.retrieve(challengeId);

      const translatedStatus: Record<SubmissionStatus, StatusModel> = {
        Pending: StatusModel.Pending,
        Error: StatusModel.Error,
        Done: StatusModel.Done,
      };

      return {
        id,
        challenge,
        status: translatedStatus[status],
        createdAt,
        challengeId,
        grade,
        repositoryUrl,
      };
    } catch (error) {
      handleError(error);
    }
  }

  @Query((returns) => ListSubmissionsOutput)
  async submissions(
    @Args() args: ListSubmissionsArgs,
  ): Promise<ListSubmissionsOutput> {
    const { challengeId, date = {}, status, limit, page } = args;

    const filters: ListSubmissionsUseCaseInput = {
      page,
      limit,
      query: {
        challengeId,
        date,
        status: graphQlToDomainSubmissionStatus(status),
      },
    };
    const output = await this.challengeService.listSubmissions(filters);
    return {
      itemsPerPage: output.itemsPerPage,
      page: output.page,
      total: output.total,
      results: output.results.map<Submission>(
        ({ challengeId, createdAt, grade, id, repositoryUrl, status }) => ({
          createdAt,
          grade,
          id,
          status: domainToGraphQLSubmissionStatus(status),
          challengeId,
          repositoryUrl,
        }),
      ),
    };
  }
}
