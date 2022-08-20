import { FakeUuidAdapter } from 'src/main/usecases/ports/fake-uuid-adapter';
import { InMemoryChallengeRepository } from 'src/main/usecases/ports/in-memory-challenge-repository';
import { ChallengeNotFoundError } from './errors/challenge-not-found.error';
import { ChallengeRepository } from './ports/challenge.repository';
import { UuidAdapter } from './ports/uuid.adapter';

type SubmissionStatus = 'Pending' | 'Error' | 'Done';

type SubmissionProps = {
  id: string;
  challenge_id?: string;
  repository_url: string;
  createdAt: Date;
  status: SubmissionStatus;
  grade?: number;
};

class Submission {
  private props: SubmissionProps;

  constructor({
    id,
    challenge_id,
    repository_url,
    createdAt = new Date(),
    status = 'Pending',
    grade = null,
  }: Partial<SubmissionProps>) {
    this.props = {
      id,
      challenge_id,
      createdAt,
      repository_url,
      status,
      grade,
    };
  }

  get id(): string {
    return this.props.id;
  }

  get challenge_id(): string {
    return this.props.challenge_id;
  }

  get repository_url(): string {
    return this.props.repository_url;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get status(): SubmissionStatus {
    return this.props.status;
  }

  get grade(): number | null {
    return this.props.grade;
  }
}

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

class SubmitChallengeUseCase {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly challengeRepository: ChallengeRepository,
    private readonly codeRepositoryUrlValidator: CodeRepositoryUrlValidator,
    private readonly uuid: UuidAdapter,
  ) {}

  async execute(
    input: SubmitChallengeUseCaseInput,
  ): Promise<SubmitChallengeUseCaseOutput> {
    let { challenge_id, repository_url } = input;
    const challengeExists = await this.challengeRepository.exists(challenge_id);
    const isValidRepositoryUrl = await this.codeRepositoryUrlValidator.validate(
      repository_url,
    );

    let status: SubmissionStatus = 'Pending';

    if (!challengeExists) {
      status = 'Error';
      challenge_id = null;
    }

    if (!isValidRepositoryUrl) {
      status = 'Error';
      repository_url = null;
    }

    const submission = await this.submissionRepository.create({
      challenge_id,
      repository_url,
      status,
      id: this.uuid.build(),
    });

    if (status === 'Error') {
      if (!challenge_id) throw new ChallengeNotFoundError();

      throw new InvalidCodeRepositoryError();
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
}

type SubmissionCreateDto = {
  id: string;
  challenge_id: string;
  repository_url: string;
  status?: SubmissionStatus;
  grade?: number;
};

class SubmissionNotFoundError extends Error {
  constructor() {
    super('Submission not found');
    this.name = 'SubmissionNotFoundError';
  }
}

class InvalidCodeRepositoryError extends Error {
  constructor() {
    super('Invalid code repository');
    this.name = 'InvalidCodeRepositoryError';
  }
}

interface SubmissionRepository {
  create(dto: SubmissionCreateDto): Promise<Submission>;
  find(id: string): Promise<Submission>;
}

class InMemorySubmissionRepository implements SubmissionRepository {
  private submissions: Submission[];

  constructor() {
    this.submissions = [];
  }

  async create({
    id,
    challenge_id,
    repository_url,
    grade,
    status,
  }: SubmissionCreateDto): Promise<Submission> {
    const submission = new Submission({
      id,
      challenge_id,
      repository_url,
      grade,
      status,
    });
    this.submissions.push(submission);

    return submission;
  }

  async find(id: string): Promise<Submission> {
    const submission = this.submissions.find(
      (submission) => submission.id === id,
    );
    if (!submission) throw new SubmissionNotFoundError();

    return submission;
  }
}

interface CodeRepositoryUrlValidator {
  validate(repository_url: string): Promise<boolean>;
}

class MockedCodeRepositoryUrlValidator implements CodeRepositoryUrlValidator {
  isValid = true;
  async validate(repository_url: string): Promise<boolean> {
    return this.isValid;
  }
}

function makeSut() {
  const submissionRepository = new InMemorySubmissionRepository();
  const challengeRepository = new InMemoryChallengeRepository();
  const codeRepositoryUrlValidator = new MockedCodeRepositoryUrlValidator();
  const uuidAdapter = new FakeUuidAdapter();
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
