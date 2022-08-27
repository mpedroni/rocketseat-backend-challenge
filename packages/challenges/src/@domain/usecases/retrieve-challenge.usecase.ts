import { ChallengeDto } from './dto/challenge.dto';
import { ChallengeRepository } from './ports/challenge.repository';
import { UseCase } from './ports/usecase.adapter';

export type RetrieveChallengeUseCaseOutput = ChallengeDto;

export class RetrieveChallengeUseCase
  implements UseCase<string, RetrieveChallengeUseCaseOutput>
{
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: string): Promise<RetrieveChallengeUseCaseOutput> {
    return this.challengeRepository.find(id);
  }
}
