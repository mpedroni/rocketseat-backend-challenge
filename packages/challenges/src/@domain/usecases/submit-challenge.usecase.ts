import { Status as SubmissionStatus } from '../entities/submission';
import { SubmissionDto } from './dto/submission.dto';
import { ChallengeNotFoundError } from './errors/challenge-not-found.error';
import { InvalidCodeRepositoryError } from './errors/invalid-code-repository.error';
import { ChallengeRepository } from './ports/challenge.repository';
import { CodeRepositoryUrlValidator } from './ports/code-repository-url-validator.adapter';
import { SubmissionRepository } from './ports/submission.repository';
import { UseCase } from './ports/usecase.adapter';
import { UuidAdapter } from './ports/uuid.adapter';

export type SubmitChallengeUseCaseInput = {
  challengeId: string;
  repository_url: string;
};

export type SubmitChallengeUseCaseOutput = SubmissionDto;

type SubmitChallengeUseCaseValidatedInput = SubmitChallengeUseCaseInput & {
  error?: Error;
};

export class SubmitChallengeUseCase
  implements UseCase<SubmitChallengeUseCaseInput, SubmitChallengeUseCaseOutput>
{
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly challengeRepository: ChallengeRepository,
    private readonly codeRepositoryUrlValidator: CodeRepositoryUrlValidator,
    private readonly uuid: UuidAdapter,
  ) {}

  async execute(
    input: SubmitChallengeUseCaseInput,
  ): Promise<SubmitChallengeUseCaseOutput> {
    const { challengeId, repository_url, error } = await this.validateInput(
      input,
    );

    const status: SubmissionStatus = !!error ? 'Error' : 'Pending';

    const submission = await this.submissionRepository.create({
      challengeId,
      repository_url,
      status,
      id: this.uuid.build(),
    });

    if (status === 'Error') {
      throw error;
    }

    return {
      challengeId: submission.challengeId,
      createdAt: submission.createdAt,
      grade: submission.grade,
      id: submission.id,
      repository_url: submission.repository_url,
      status: submission.status,
    };
  }

  private async validateInput({
    challengeId,
    repository_url,
  }: SubmitChallengeUseCaseInput): Promise<SubmitChallengeUseCaseValidatedInput> {
    const challengeExists = await this.challengeRepository.exists(challengeId);
    const isValidCodeRepositoryUrl =
      await this.codeRepositoryUrlValidator.validate(repository_url);
    let error: Error = null;

    if (!isValidCodeRepositoryUrl) error = new InvalidCodeRepositoryError();
    if (!challengeExists) error = new ChallengeNotFoundError();
    return {
      challengeId: challengeExists ? challengeId : null,
      repository_url: isValidCodeRepositoryUrl ? repository_url : null,
      error,
    };
  }
}
