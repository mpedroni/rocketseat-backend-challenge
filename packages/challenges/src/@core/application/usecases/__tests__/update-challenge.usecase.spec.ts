import { InMemoryChallengeRepository } from 'src/@core/main/application/ports/in-memory-challenge.repository';
import { ChallengeNotFoundError } from '../../errors/challenge-not-found.error';
import { UpdateChallengeUseCase } from '../update-challenge.usecase';

function makeSut() {
  const challengeRepository = new InMemoryChallengeRepository();
  const sut = new UpdateChallengeUseCase(challengeRepository);

  return {
    sut,
    challengeRepository,
  };
}

describe('UpdateChallengeUseCase', () => {
  it('should be able to update a existing Challenge data', async () => {
    const { sut, challengeRepository } = makeSut();
    const challenge = {
      id: 'fake-uuid',
      description: 'Fake description',
      title: 'Fake Title',
    };
    await challengeRepository.create(challenge);
    const changedChallenge = {
      id: challenge.id,
      description: 'Another fake description',
      title: 'Another fake Title',
    };

    let output = await sut.execute(changedChallenge);
    expect(output.description).toEqual(changedChallenge.description);
    expect(output.title).toEqual(changedChallenge.title);

    const repoChallenge = await challengeRepository.find(challenge.id);
    expect(repoChallenge.description).toEqual(changedChallenge.description);
    expect(repoChallenge.title).toEqual(changedChallenge.title);

    output = await sut.execute({
      description: undefined,
      title: undefined,
      id: challenge.id,
    });
    expect(output.description).toEqual(changedChallenge.description);
    expect(output.title).toEqual(changedChallenge.title);
  });

  it('should throws an error when try to update an inexistent challenge id', async () => {
    const { sut } = makeSut();
    const challenge = {
      id: 'inexistent-challenge-id',
      title: '',
      description: '',
    };

    await expect(sut.execute(challenge)).rejects.toBeInstanceOf(
      ChallengeNotFoundError,
    );
  });

  it('should updates only the given props', async () => {
    const { sut, challengeRepository } = makeSut();
    const challenge = {
      id: 'fake-uuid',
      description: 'Fake description',
      title: 'Fake Title',
    };
    const changedChallenge = {
      id: challenge.id,
      title: 'Another fake Title',
    };
    await challengeRepository.create(challenge);
    const output = await sut.execute(changedChallenge);
    expect(output.description).toEqual(challenge.description);
  });
});
