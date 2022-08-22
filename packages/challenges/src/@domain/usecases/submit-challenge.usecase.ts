import { Status as SubmissionStatus } from '../entities/submission';
import { ChallengeNotFoundError } from './errors/challenge-not-found.error';
import { InvalidCodeRepositoryError } from './errors/invalid-code-repository.error';
import { ChallengeRepository } from './ports/challenge.repository';
import { CodeRepositoryUrlValidator } from './ports/code-repository-url-validator.adapter';
import { SubmissionRepository } from './ports/submission.repository';
import { UuidAdapter } from './ports/uuid.adapter';

type SubmitChallengeUseCaseInput = {
  challenge_id: string;
  repository_url: string;
};

type SubmitChallengeUseCaseOutput = {
  id: string;
  challenge_id: string;
  repository_url: string;
  createdAt: Date;
  status: SubmissionStatus;
  grade?: number;
};

type SubmitChallengeUseCaseValidatedInput = SubmitChallengeUseCaseInput & {
  error?: Error;
};

export class SubmitChallengeUseCase {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly challengeRepository: ChallengeRepository,
    private readonly codeRepositoryUrlValidator: CodeRepositoryUrlValidator,
    private readonly uuid: UuidAdapter,
  ) {}

  async execute(
    input: SubmitChallengeUseCaseInput,
  ): Promise<SubmitChallengeUseCaseOutput> {
    const { challenge_id, repository_url, error } = await this.validateInput(
      input,
    );

    const status: SubmissionStatus = !!error ? 'Error' : 'Pending';

    const submission = await this.submissionRepository.create({
      challenge_id,
      repository_url,
      status,
      id: this.uuid.build(),
    });

    if (status === 'Error') {
      throw error;
    }

    return {
      challenge_id: submission.challenge_id,
      createdAt: submission.createdAt,
      grade: submission.grade,
      id: submission.id,
      repository_url: submission.repository_url,
      status: submission.status,
    };
  }

  private async validateInput({
    challenge_id,
    repository_url,
  }: SubmitChallengeUseCaseInput): Promise<SubmitChallengeUseCaseValidatedInput> {
    const challengeExists = await this.challengeRepository.exists(challenge_id);
    const isValidCodeRepositoryUrl =
      await this.codeRepositoryUrlValidator.validate(repository_url);
    let error: Error = null;

    if (!isValidCodeRepositoryUrl) error = new InvalidCodeRepositoryError();
    if (!challengeExists) error = new ChallengeNotFoundError();
    return {
      challenge_id: challengeExists ? challenge_id : null,
      repository_url: isValidCodeRepositoryUrl ? repository_url : null,
      error,
    };
  }
}
