import { InMemoryChallengeRepository } from 'src/@core/main/application/ports/in-memory-challenge.repository';
import { Challenge } from '../../../domain/entities/challenge';
import { ChallengeNotFoundError } from '../../errors/challenge-not-found.error';
import { RetrieveChallengeUseCase } from '../retrieve-challenge.usecase';

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
