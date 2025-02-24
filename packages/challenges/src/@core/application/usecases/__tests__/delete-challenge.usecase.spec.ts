import { InMemoryChallengeRepository } from 'src/@core/main/application/ports/in-memory-challenge.repository';
import { DeleteChallengeUseCase } from '../delete-challenge.usecase';
import { ChallengeNotFoundError } from '../../errors/challenge-not-found.error';

function makeSut() {
  const challengeRepository = new InMemoryChallengeRepository();
  const sut = new DeleteChallengeUseCase(challengeRepository);

  return {
    challengeRepository,
    sut,
  };
}

describe('DeleteChallengeUseCase', () => {
  it('should be able to delete a challenge', async () => {
    const { sut, challengeRepository } = makeSut();
    const id = 'fake-uuid';
    await challengeRepository.create({
      id,
      description: 'Fake Description',
      title: 'Fake Title',
    });
    await sut.execute(id);
    await expect(challengeRepository.find(id)).rejects.toBeInstanceOf(
      ChallengeNotFoundError,
    );
  });

  it('should throws an error when delete an inexistent challenge id', async () => {
    const { sut } = makeSut();
    const id = 'fake-uuid';
    await expect(sut.execute(id)).rejects.toBeInstanceOf(
      ChallengeNotFoundError,
    );
  });
});
