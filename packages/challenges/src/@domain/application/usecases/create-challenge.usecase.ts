import { ChallengeRepository } from './ports/challenge.repository';
import { UseCase } from './ports/usecase.adapter';
import { UuidAdapter } from './ports/uuid.adapter';

export type CreateChallengeUsecaseInput = {
  title: string;
  description: string;
};

export type CreateChallengeUsecaseOutput = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

export class CreateChallengeUseCase
  implements UseCase<CreateChallengeUsecaseInput, CreateChallengeUsecaseOutput>
{
  constructor(
    private challengeRepository: ChallengeRepository,
    private uuid: UuidAdapter,
  ) {}

  async execute(
    input: CreateChallengeUsecaseInput,
  ): Promise<CreateChallengeUsecaseOutput> {
    const id = this.uuid.build();

    const data = {
      ...input,
      id,
    };

    const { description, createdAt, title } =
      await this.challengeRepository.create(data);

    return {
      id,
      description,
      createdAt,
      title,
    };
  }
}
