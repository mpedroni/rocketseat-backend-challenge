import { Injectable } from '@nestjs/common';
import {
  CreateChallengeUseCase,
  CreateChallengeUsecaseInput,
  CreateChallengeUsecaseOutput,
} from 'src/@domain/usecases/create-challenge.usecase';
import { DeleteChallengeUseCase } from 'src/@domain/usecases/delete-challenge.usecase';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
  ) {}

  async create(
    input: CreateChallengeUsecaseInput,
  ): Promise<CreateChallengeUsecaseOutput> {
    const output = await this.createChallengeUseCase.execute(input);
    return output;
  }

  async delete(id: string): Promise<void> {
    await this.deleteChallengeUseCase.execute(id);
  }
}
