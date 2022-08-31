import { InMemoryChallengeRepository } from 'src/main/usecases/ports/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from 'src/main/usecases/ports/in-memory-submission.repository';
import { ListSubmissionsUseCase } from '../list-submissions.usecase';
import { Status as SubmissionStatus } from '../../domain/entities/submission';

jest.useFakeTimers({
  now: new Date(),
});

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const mockedSubmissions = [
  {
    id: 'fake-uuid-1',
    createdAt: new Date(Date.now() - ONE_DAY_IN_MILLISECONDS),
    repositoryUrl: 'fake-repository-url',
  },
  {
    id: 'fake-uuid-2',
    createdAt: new Date(Date.now() - 2 * ONE_DAY_IN_MILLISECONDS),
    repositoryUrl: 'fake-repository-url',
  },
  {
    id: 'fake-uuid-3',
    status: 'Done' as SubmissionStatus,
    createdAt: new Date(Date.now() - 7 * ONE_DAY_IN_MILLISECONDS),
    grade: 8,
    repositoryUrl: 'fake-repository-url',
  },
];

async function makeSut() {
  const challengeRepository = new InMemoryChallengeRepository();
  const challenge = await challengeRepository.create({
    description: 'Fake challenge description',
    title: 'Fake Challenge Title',
    id: 'fake-challenge-id',
  });
  const submissionRepository = new InMemorySubmissionRepository();
  for await (const submission of mockedSubmissions) {
    await submissionRepository.create({
      ...submission,
      challengeId: challenge.id,
    });
  }
  const sut = new ListSubmissionsUseCase(submissionRepository);

  return {
    sut,
    submissionRepository,
    challengeRepository,
    challenge,
  };
}

describe('ListSubmissionsUseCase', () => {
  it('should be able to able to list all the created Submissions', async () => {
    const { sut } = await makeSut();

    const submissions = await sut.execute();
    expect(submissions.results.length).toBe(3);
  });

  it('should be able to paginate the Submissions', async () => {
    const { sut } = await makeSut();

    let submissions = await sut.execute({ limit: 2 });
    expect(submissions.results.length).toBe(2);
    expect(submissions.page).toBe(1);
    expect(submissions.itemsPerPage).toBe(2);

    submissions = await sut.execute({ limit: 2, page: 2 });
    expect(submissions.results.length).toBe(1);
    expect(submissions.page).toBe(2);
    expect(submissions.itemsPerPage).toBe(2);
  });

  it('should be able to filter the Submissions by Challenge', async () => {
    const { sut, challenge } = await makeSut();

    const submissions = await sut.execute({
      query: {
        challengeId: challenge.id,
      },
    });
    expect(submissions.results.length).toBe(3);
  });

  it('should be able to filter the Submissions by status', async () => {
    const { sut } = await makeSut();

    const submissions = await sut.execute({
      query: {
        status: 'Done',
      },
    });
    expect(submissions.results.length).toBe(1);
  });

  it('should be able to filter the Submissions by creation date interval', async () => {
    const { sut } = await makeSut();

    const submissions = await sut.execute({
      query: {
        date: {
          start: new Date(Date.now() - 3 * ONE_DAY_IN_MILLISECONDS),
        },
      },
    });
    expect(submissions.results.length).toBe(2);
  });
});
