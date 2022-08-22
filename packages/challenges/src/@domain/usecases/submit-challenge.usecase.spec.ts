import { InMemoryChallengeRepository } from 'src/main/usecases/ports/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from 'src/main/usecases/ports/in-memory-submission.repository';
import { MockedCodeRepositoryUrlValidator } from 'src/main/usecases/ports/mocked-code-repository-url-validator.adapter';
import { MockedUuidAdapter } from 'src/main/usecases/ports/mocked-uuid-adapter.adapter';
import { ChallengeNotFoundError } from './errors/challenge-not-found.error';
import { InvalidCodeRepositoryError } from './errors/invalid-code-repository.error';
import { SubmitChallengeUseCase } from './submit-challenge.usecase';

function makeSut() {
  const submissionRepository = new InMemorySubmissionRepository();
  const challengeRepository = new InMemoryChallengeRepository();
  const codeRepositoryUrlValidator = new MockedCodeRepositoryUrlValidator();
  const uuidAdapter = new MockedUuidAdapter();
  const sut = new SubmitChallengeUseCase(
    submissionRepository,
    challengeRepository,
    codeRepositoryUrlValidator,
    uuidAdapter,
  );

  return {
    sut,
    submissionRepository,
    codeRepositoryUrlValidator,
    challengeRepository,
    uuidAdapter,
  };
}

describe('SubmitChallengeUseCase', () => {
  it("should be able to submit a Challenge and have 'Pending' as initial status", async () => {
    const { sut, challengeRepository } = makeSut();
    const input = {
      challenge_id: 'fake-challenge-id',
      repository_url: 'fake-repository-url',
    };
    await challengeRepository.create({
      description: 'Fake challenge description',
      title: 'Fake challenge title',
      id: input.challenge_id,
    });
    const submission = await sut.execute(input);

    expect(submission.id).toBeTruthy();
    expect(submission.status).toEqual('Pending');
    expect(submission.grade).toEqual(null);
  });

  it("should create the Submission with the 'Error' status if the given Challenge doesn't exist and throw an error", async () => {
    const { sut, uuidAdapter, submissionRepository } = makeSut();
    const submissionId = 'fake-submission-id';
    uuidAdapter.uuid = submissionId;
    const input = {
      challenge_id: 'inexistent-challenge-id',
      repository_url: 'fake-repository-url',
    };

    await expect(sut.execute(input)).rejects.toThrowError(
      ChallengeNotFoundError,
    );

    const submission = await submissionRepository.find(submissionId);
    expect(submission.status).toEqual('Error');
    expect(submission.grade).toEqual(null);
  });

  it("should create the Submission with the 'Error' status if the given repository_url isn't a valid GitHub repository and throw an error", async () => {
    const {
      sut,
      challengeRepository,
      uuidAdapter,
      codeRepositoryUrlValidator,
    } = makeSut();
    const submissionId = 'fake-submission-id';
    uuidAdapter.uuid = submissionId;
    codeRepositoryUrlValidator.isValid = false;
    const input = {
      challenge_id: 'fake-challenge-id',
      repository_url: 'not-valid-repository-url',
    };

    await challengeRepository.create({
      description: 'Fake challenge description',
      title: 'Fake challenge title',
      id: input.challenge_id,
    });

    await expect(sut.execute(input)).rejects.toThrowError(
      InvalidCodeRepositoryError,
    );
  });
});
