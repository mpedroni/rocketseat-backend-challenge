import { InMemoryChallengeRepository } from 'src/main/usecases/ports/in-memory-challenge.repository';
import { ListChallengesUseCase } from './list-challenges.usecase';

function makeSut() {
  const challengeRepository = new InMemoryChallengeRepository();
  const sut = new ListChallengesUseCase(challengeRepository);

  return {
    sut,
    challengeRepository,
  };
}

const mockedChallenges = [
  {
    id: 'fake-uuid-1',
    description: 'Fake challenge description',
    title: 'Fake Challenge Title',
  },
  {
    id: 'fake-uuid-2',
    description: 'Another fake challenge description',
    title: 'Another Fake Challenge Title',
  },
  {
    id: 'fake-uuid-3',
    description: 'More One Another Fake challenge description',
    title: 'More One Another Fake Challenge Title',
  },
];

describe('ListChallengesUseCase', () => {
  it('should be able to list all the created Challenges', async () => {
    const { sut, challengeRepository } = makeSut();

    for await (const challenge of mockedChallenges) {
      challengeRepository.create(challenge);
    }

    const list = await sut.execute();
    expect(list.results.length).toBe(3);
  });

  it('should be able to paginate the list return', async () => {
    const { sut, challengeRepository } = makeSut();

    for await (const challenge of mockedChallenges) {
      challengeRepository.create(challenge);
    }

    let list = await sut.execute({ limit: 2 });
    expect(list.results.length).toBe(2);
    expect(list.page).toBe(1);
    expect(list.itemsPerPage).toBe(2);

    list = await sut.execute({ limit: 2, page: 2 });
    expect(list.results.length).toBe(1);
    expect(list.page).toBe(2);
    expect(list.itemsPerPage).toBe(2);
  });

  it('should be able to filter the Challenges by description and title', async () => {
    const { sut, challengeRepository } = makeSut();

    for await (const challenge of mockedChallenges) {
      challengeRepository.create(challenge);
    }

    let query = {
      title: 'another',
      description: '',
    };
    let challenges = (await sut.execute({ query })).results;
    expect(challenges.length).toBe(2);

    query = {
      title: '',
      description: 'CHALLENGE desCRIption',
    };
    challenges = (await sut.execute({ query })).results;
    expect(challenges.length).toBe(3);
  });
});
