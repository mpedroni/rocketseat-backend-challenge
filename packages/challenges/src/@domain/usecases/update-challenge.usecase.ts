import { ChallengeDto } from './dto/challenge.dto';
import { ChallengeRepository } from './ports/challenge.repository';
import { UseCase } from './ports/usecase.adapter';

export type UpdateChallengeUseCaseInput = {
  id: string;
  title?: string;
  description?: string;
};

export type UpdateChallengeUseCaseOutput = ChallengeDto;

export class UpdateChallengeUseCase
  implements UseCase<UpdateChallengeUseCaseInput, UpdateChallengeUseCaseOutput>
{
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(
    input: UpdateChallengeUseCaseInput,
  ): Promise<UpdateChallengeUseCaseOutput> {
    const { createdAt, description, id, title } =
      await this.challengeRepository.update(input);

    return {
      createdAt,
      description,
      id,
      title,
    };
  }
}
