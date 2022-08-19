import { ChallengeRepository } from './ports/challenge.repository';

export class DeleteChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(id: string): Promise<void> {
    await this.challengeRepository.delete(id);
  }
}
