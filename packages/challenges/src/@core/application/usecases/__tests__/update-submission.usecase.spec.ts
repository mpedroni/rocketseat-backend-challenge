import { InMemoryChallengeRepository } from 'src/@core/main/application/ports/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from 'src/@core/main/application/ports/in-memory-submission.repository';
import { InvalidSubmissionGradeError } from '../../../domain/entities/submission';
import { SubmissionNotFoundError } from '../../errors/submission-not-found.error';
import { UpdateSubmissionUseCase } from '../update-submission.usecase';

async function makeSut() {
  const challengeRepository = new InMemoryChallengeRepository();
  await challengeRepository.create({
    id: 'fake-challenge-id',
    description: 'Fake challenge description',
    title: 'Fake Challenge Title',
  });
  const submissionRepository = new InMemorySubmissionRepository();
  const sut = new UpdateSubmissionUseCase(submissionRepository);

  return {
    sut,
    challengeRepository,
    submissionRepository,
  };
}

describe('UpdateSubmissionUseCase', () => {
  it('should be able to update a Submission', async () => {
    const { sut, submissionRepository } = await makeSut();
    await submissionRepository.create({
      id: 'fake-submission-id',
      challengeId: 'fake-challenge-id',
      status: 'Pending',
      createdAt: new Date(),
      repositoryUrl: 'fake-repository-url',
    });

    const input = {
      submissionId: 'fake-submission-id',
      grade: 9,
    };
    await sut.execute(input);
    const output = await submissionRepository.find(input.submissionId);
    expect(output.grade).toEqual(input.grade);
    expect(output.status).toEqual('Done');
  });

  it("should throw an error if the Submission's grade aren't between 0 and 10", async () => {
    const { sut, submissionRepository } = await makeSut();
    await submissionRepository.create({
      id: 'fake-submission-id',
      challengeId: 'fake-challenge-id',
      status: 'Pending',
      createdAt: new Date(),
      repositoryUrl: 'fake-repository-url',
    });
    const input = {
      submissionId: 'fake-submission-id',
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
    const { sut } = await makeSut();
    const input = {
      submissionId: 'inexistent-submission-id',
      grade: 10,
    };

    await expect(sut.execute(input)).rejects.toThrowError(
      SubmissionNotFoundError,
    );
  });
});
