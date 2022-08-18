import { Challenge } from '../entities/challenge';
import {
  ChallengeCreateDto,
  ChallengeRepository,
} from './ports/challenge.repository';

class ChallengeNotFoundError extends Error {
  constructor() {
    super('Challenge not found');
    this.name = 'ChallengeNotFoundError';
  }
}

class InMemoryChallengeRepository implements ChallengeRepository {
  private challenges: Challenge[] = [];

  async find(id: string): Promise<Challenge> {
    const challenge = this.challenges.find((challenge) => challenge.id === id);
    if (!challenge) throw new ChallengeNotFoundError();
    return challenge;
  }
  async create(data: ChallengeCreateDto): Promise<Challenge> {
    const { id, title, description } = data;
    const challenge = new Challenge({ id, title, description });
    this.challenges.push(challenge);
    return challenge;
  }
}

type RetrieveChallengeUseCaseOutput = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

class RetrieveChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: string): Promise<RetrieveChallengeUseCaseOutput> {
    return this.challengeRepository.find(id);
  }
}

function makeSut() {
  const challengeRepository = new InMemoryChallengeRepository();
  const sut = new RetrieveChallengeUseCase(challengeRepository);

  return {
    sut,
    challengeRepository,
  };
}

describe('RetrieveChallengeUseCase', () => {
  it('should be able to retrieve a created challenge', async () => {
    const { sut, challengeRepository } = makeSut();

    const challenge = {
      id: 'fake-uuid',
      description: 'Fake Description',
      title: 'Fake Title',
    };
    await challengeRepository.create(challenge);
    const output = await sut.execute(challenge.id);

    expect(output).toBeInstanceOf(Challenge);
    expect(output.id).toEqual(challenge.id);
  });

  it('should throw an error when retrieve an inexistent challenge id', async () => {
    const { sut } = makeSut();

    await expect(sut.execute('inexistent-challenge-id')).rejects.toBeInstanceOf(
      ChallengeNotFoundError,
    );
  });
});
