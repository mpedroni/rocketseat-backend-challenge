import { ChallengeRepository } from './ports/challenge.repository';
import { UseCase } from './ports/usecase.adapter';

type RetrieveChallengeUseCaseOutput = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

export class RetrieveChallengeUseCase
  implements UseCase<string, RetrieveChallengeUseCaseOutput>
{
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: string): Promise<RetrieveChallengeUseCaseOutput> {
    return this.challengeRepository.find(id);
  }
}
