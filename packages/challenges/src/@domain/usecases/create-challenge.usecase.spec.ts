import { InMemoryChallengeRepository } from 'src/main/usecases/ports/in-memory-challenge.repository';
import { MockedUuidAdapter } from 'src/main/usecases/ports/mocked-uuid-adapter.adapter';
import { CreateChallengeUseCase } from './create-challenge.usecase';
import { ChallengeIdentifierCollisionError } from './errors/challenge-identifier-collision.error';

jest.useFakeTimers({ now: new Date() });

function makeSut() {
  const uuidBuilder = new MockedUuidAdapter();
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
