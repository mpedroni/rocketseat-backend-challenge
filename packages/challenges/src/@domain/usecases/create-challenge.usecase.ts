import { ChallengeIdentifierCollisionError } from './errors/challenge-identifier-collision.error';
import { ChallengeRepository } from './ports/challenge.repository';
import { UuidAdapter } from './ports/uuid.adapter';

type CreateChallengeUsecaseInput = {
  title: string;
  description: string;
};

type CreateChallengeUsecaseOutput = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

export class CreateChallengeUseCase {
  constructor(
    private challengeRepository: ChallengeRepository,
    private uuid: UuidAdapter,
  ) {}

  async execute(
    input: CreateChallengeUsecaseInput,
  ): Promise<CreateChallengeUsecaseOutput> {
    const id = this.uuid.build();

    const isIdAlreadyInUse = !!(await this.challengeRepository.find(id));
    if (isIdAlreadyInUse) throw new ChallengeIdentifierCollisionError();

    const data = {
      ...input,
      id,
      createdAt: new Date(),
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
