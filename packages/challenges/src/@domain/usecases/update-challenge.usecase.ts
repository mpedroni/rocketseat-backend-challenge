import { ChallengeRepository } from './ports/challenge.repository';
import { UseCase } from './ports/usecase.adapter';

type UpdateChallengeUseCaseInput = {
  id: string;
  title: string;
  description: string;
};

type UpdateChallengeUseCaseOutput = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UpdateChallengeUseCase
  implements UseCase<UpdateChallengeUseCaseInput, UpdateChallengeUseCaseOutput>
{
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(
    input: Partial<UpdateChallengeUseCaseInput>,
  ): Promise<UpdateChallengeUseCaseOutput> {
    const { createdAt, description, id, title } =
      await this.challengeRepository.update(input);
    return {
      createdAt,
      description,
      id,
      title,
      updatedAt: new Date(),
    };
  }
}
