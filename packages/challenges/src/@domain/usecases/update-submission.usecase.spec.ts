import { InMemoryChallengeRepository } from 'src/main/usecases/ports/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from 'src/main/usecases/ports/in-memory-submission.repository';
import {
  InvalidSubmissionGradeError,
  Status as SubmissionStatus,
} from '../entities/submission';
import { SubmissionNotFoundError } from './errors/submission-not-found.error';
import { SubmissionRepository } from './ports/submission.repository';

type UpdateSubmissionUseCaseInput = {
  submission_id: string;
  grade: number;
};

type UpdateSubmissionUseCaseOutput = {
  submission_id: string;
  grade: number;
  status: SubmissionStatus;
  challenge_id?: string;
  repository_url: string;
  createdAt: Date;
};

class UpdateSubmissionUseCase {
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async execute({
    grade,
    submission_id,
  }: UpdateSubmissionUseCaseInput): Promise<UpdateSubmissionUseCaseOutput> {
    const submission = await this.submissionRepository.update({
      grade,
      id: submission_id,
    });

    return {
      createdAt: submission.createdAt,
      grade: submission.grade,
      repository_url: submission.repository_url,
      status: submission.status,
      submission_id: submission.id,
      challenge_id: submission.challenge_id,
    };
  }
}

describe('UpdateSubmissionUseCase', () => {
  it('should be able to update a Submission', async () => {
    const challengeRepository = new InMemoryChallengeRepository();
    await challengeRepository.create({
      id: 'fake-challenge-id',
      description: 'Fake challenge description',
      title: 'Fake Challenge Title',
    });
    const submissionRepository = new InMemorySubmissionRepository();
    await submissionRepository.create({
      id: 'fake-submission-id',
      challenge_id: 'fake-challenge-id',
      repository_url: 'fake-repository-url',
    });
    const sut = new UpdateSubmissionUseCase(submissionRepository);
    const input = {
      submission_id: 'fake-submission-id',
      grade: 9,
    };
    await sut.execute(input);
    const output = await submissionRepository.find(input.submission_id);
    expect(output.grade).toEqual(input.grade);
    expect(output.status).toEqual('Done');
  });

  it("should throw an error if the Submission's grade aren't between 0 and 10", async () => {
    const challengeRepository = new InMemoryChallengeRepository();
    await challengeRepository.create({
      id: 'fake-challenge-id',
      description: 'Fake challenge description',
      title: 'Fake Challenge Title',
    });
    const submissionRepository = new InMemorySubmissionRepository();
    await submissionRepository.create({
      id: 'fake-submission-id',
      challenge_id: 'fake-challenge-id',
      repository_url: 'fake-repository-url',
    });
    const sut = new UpdateSubmissionUseCase(submissionRepository);
    const input = {
      submission_id: 'fake-submission-id',
      grade: -1,
    };

    await expect(sut.execute(input)).rejects.toThrowError(
      InvalidSubmissionGradeError,
    );

    input.grade = 11;
    await expect(sut.execute(input)).rejects.toThrowError(
      InvalidSubmissionGradeError,
    );
  });

  it("should throw an error if the given Submission doesn't exists", async () => {
    const challengeRepository = new InMemoryChallengeRepository();
    await challengeRepository.create({
      id: 'fake-challenge-id',
      description: 'Fake challenge description',
      title: 'Fake Challenge Title',
    });
    const submissionRepository = new InMemorySubmissionRepository();
    const sut = new UpdateSubmissionUseCase(submissionRepository);
    const input = {
      submission_id: 'inexistent-submission-id',
      grade: 10,
    };

    await expect(sut.execute(input)).rejects.toThrowError(
      SubmissionNotFoundError,
    );
  });
});
