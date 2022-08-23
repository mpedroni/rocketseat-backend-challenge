import { ChallengeRepository } from './ports/challenge.repository';
import { UseCase } from './ports/usecase.adapter';

export class DeleteChallengeUseCase implements UseCase<string, void> {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: string): Promise<void> {
    await this.challengeRepository.delete(id);
  }
}
