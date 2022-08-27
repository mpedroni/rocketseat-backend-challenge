import { Injectable } from '@nestjs/common';
import {
  CreateChallengeUseCase,
  CreateChallengeUsecaseInput,
  CreateChallengeUsecaseOutput,
} from 'src/@domain/usecases/create-challenge.usecase';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
  ) {}

  async create(
    input: CreateChallengeUsecaseInput,
  ): Promise<CreateChallengeUsecaseOutput> {
    const output = await this.createChallengeUseCase.execute(input);
    return output;
  }
}
