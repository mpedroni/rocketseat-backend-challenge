import { ChallengeRepository } from './ports/challenge.repository';

type RetrieveChallengeUseCaseOutput = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

export class RetrieveChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: string): Promise<RetrieveChallengeUseCaseOutput> {
    return this.challengeRepository.find(id);
  }
}
