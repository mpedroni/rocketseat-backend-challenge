import { InMemoryChallengeRepository } from 'src/main/usecases/ports/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from 'src/main/usecases/ports/in-memory-submission.repository';
import { Status as SubmissionStatus } from '../entities/submission';
import {
  SubmissionListOutput,
  SubmissionListQueryFilter,
  SubmissionRepository,
} from './ports/submission.repository';
import { UseCase } from './ports/usecase.adapter';

type ListSubmissionsUseCaseInput = {
  limit?: number;
  page?: number;
  query?: SubmissionListQueryFilter;
};

type ListSubmissionsUseCaseOutput = SubmissionListOutput;

class ListSubmissionsUseCase
  implements UseCase<ListSubmissionsUseCaseInput, ListSubmissionsUseCaseOutput>
{
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  execute({
    limit,
    page,
    query,
  }: ListSubmissionsUseCaseInput = {}): Promise<ListSubmissionsUseCaseOutput> {
    return this.submissionRepository.list({ limit, page, query });
  }
}

async function makeSut() {
  const challengeRepository = new InMemoryChallengeRepository();
  const challenge = await challengeRepository.create({
    description: 'Fake challenge description',
    title: 'Fake Challenge Title',
    id: 'fake-challenge-id',
  });
  const submissionRepository = new InMemorySubmissionRepository();
  const sut = new ListSubmissionsUseCase(submissionRepository);

  return {
    sut,
    submissionRepository,
    challengeRepository,
    challenge,
  };
}

jest.useFakeTimers({
  now: new Date(),
});

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const mockedSubmissions = [
  {
    id: 'fake-uuid-1',
    createdAt: new Date(Date.now() - ONE_DAY_IN_MILLISECONDS),
    repository_url: 'fake-repository-url',
  },
  {
    id: 'fake-uuid-2',
    createdAt: new Date(Date.now() - 2 * ONE_DAY_IN_MILLISECONDS),
    repository_url: 'fake-repository-url',
  },
  {
    id: 'fake-uuid-3',
    status: 'Done',
    createdAt: new Date(Date.now() - 7 * ONE_DAY_IN_MILLISECONDS),
    grade: 8,
    repository_url: 'fake-repository-url',
  },
];

describe('ListSubmissionsUseCase', () => {
  it('should be able to able to list all the created Submissions', async () => {
    const { sut, submissionRepository, challenge } = await makeSut();

    for await (const submission of mockedSubmissions) {
      await submissionRepository.create({
        id: submission.id,
        challenge_id: challenge.id,
        repository_url: submission.repository_url,
      });
    }

    const submissions = await sut.execute();
    expect(submissions.results.length).toBe(3);
  });

  it('should be able to paginate the Submissions', async () => {
    const { sut, submissionRepository, challenge } = await makeSut();

    for await (const submission of mockedSubmissions) {
      submissionRepository.create({
        challenge_id: challenge.id,
        repository_url: submission.repository_url,
        id: submission.id,
      });
    }

    let submissions = await sut.execute({ limit: 2 });
    expect(submissions.results.length).toBe(2);
    expect(submissions.page).toBe(1);
    expect(submissions.itemsPerPage).toBe(2);

    submissions = await sut.execute({ limit: 2, page: 2 });
    expect(submissions.results.length).toBe(1);
    expect(submissions.page).toBe(2);
    expect(submissions.itemsPerPage).toBe(2);
  });

  it('should be able to filter the Submissions by Challenge, creation date interval and status', async () => {
    const { sut, submissionRepository, challenge } = await makeSut();

    for await (const submission of mockedSubmissions) {
      submissionRepository.create({
        challenge_id: challenge.id,
        grade: submission.grade,
        created_at: submission.createdAt,
        status: submission.status as SubmissionStatus,
        repository_url: submission.repository_url,
        id: submission.id,
      });
    }

    let submissions = await sut.execute({
      query: {
        challenge_id: challenge.id,
      },
    });
    expect(submissions.results.length).toBe(3);

    submissions = await sut.execute({
      query: {
        status: 'Done',
      },
    });

    expect(submissions.results.length).toBe(1);
    submissions = await sut.execute({
      query: {
        date: {
          start: new Date(Date.now() - 3 * ONE_DAY_IN_MILLISECONDS),
        },
      },
    });
    expect(submissions.results.length).toBe(2);
  });
});
