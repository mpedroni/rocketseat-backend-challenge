import { Challenge } from '../entities/challenge';
import { CreateChallengeUseCase } from './create-challenge.usecase';
import { ChallengeIdentifierCollisionError } from './errors/challenge-identifier-collision.error';
import { ChallengeRepository } from './ports/challenge.repository';
import { UuidAdapter } from './ports/uuid.adapter';

jest.useFakeTimers({ now: new Date() });

class FakeUuidAdapter implements UuidAdapter {
  uuid: string;
  constructor(uuid = 'fake-uuid') {
    this.uuid = uuid;
  }

  build(): string {
    return this.uuid;
  }
}

class InMemoryChallengeRepository implements ChallengeRepository {
  private challenges: Challenge[] = [];

  async find(id: string): Promise<Challenge> {
    const challenge = this.challenges.find((challenge) => challenge.id === id);
    return challenge;
  }
  async create(data): Promise<Challenge> {
    const { id, title, description } = data;
    const challenge = new Challenge({ id, title, description });
    this.challenges.push(challenge);
    return challenge;
  }
}

function makeSut() {
  const uuidBuilder = new FakeUuidAdapter();
  const challengeRepository = new InMemoryChallengeRepository();
  const sut = new CreateChallengeUseCase(challengeRepository, uuidBuilder);

  return {
    uuidBuilder,
    challengeRepository,
    sut,
  };
}

describe('CreateChallengeUseCase', () => {
  it('should be able to create a Challenge', async () => {
    const title = 'Fake Challenge';
    const description = 'This is a fake challenge';
    const id = 'fake-uuid';
    const input = {
      title,
      description,
    };
    const output = {
      id,
      title,
      description,
      createdAt: new Date(),
    };
    const { sut } = makeSut();
    const challenge = await sut.execute(input);
    expect(challenge).toMatchObject(output);
  });

  it('should not be able to create Challenges with the same id', async () => {
    const input = {
      title: 'Fake Challenge',
      description: 'This is a fake challenge',
    };
    const { sut } = makeSut();
    await sut.execute(input);

    await expect(sut.execute(input)).rejects.toBeInstanceOf(
      ChallengeIdentifierCollisionError,
    );
  });
});
