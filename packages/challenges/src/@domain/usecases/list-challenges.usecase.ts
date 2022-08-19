import { ChallengeRepository } from './ports/challenge.repository';

type ListChallengesUseCaseInput = {
  limit?: number;
  page?: number;
  query?: {
    title?: string;
    description?: string;
  };
};

export class ListChallengesUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute({ limit, page, query = {} }: ListChallengesUseCaseInput = {}) {
    return this.challengeRepository.list({ limit, page, query });
  }
}
