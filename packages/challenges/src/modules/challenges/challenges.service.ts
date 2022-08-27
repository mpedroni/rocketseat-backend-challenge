import { Injectable } from '@nestjs/common';
import {
  CreateChallengeUseCase,
  CreateChallengeUsecaseInput,
  CreateChallengeUsecaseOutput,
} from 'src/@domain/usecases/create-challenge.usecase';
import { DeleteChallengeUseCase } from 'src/@domain/usecases/delete-challenge.usecase';
import {
  ListChallengesUseCase,
  ListChallengesUseCaseInput,
  ListChallengesUseCaseOutput,
} from 'src/@domain/usecases/list-challenges.usecase';
import {
  RetrieveChallengeUseCase,
  RetrieveChallengeUseCaseOutput,
} from 'src/@domain/usecases/retrieve-challenge.usecase';
import {
  UpdateChallengeUseCase,
  UpdateChallengeUseCaseInput,
  UpdateChallengeUseCaseOutput,
} from 'src/@domain/usecases/update-challenge.usecase';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
    private readonly listChallengesUseCase: ListChallengesUseCase,
    private readonly retrieveChallengeUseCase: RetrieveChallengeUseCase,
    private readonly updateChallengeUseCase: UpdateChallengeUseCase,
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

  async list(
    filters: ListChallengesUseCaseInput,
  ): Promise<ListChallengesUseCaseOutput> {
    return await this.listChallengesUseCase.execute(filters);
  }

  async retrieve(id: string): Promise<RetrieveChallengeUseCaseOutput> {
    return await this.retrieveChallengeUseCase.execute(id);
  }

  async update(
    input: UpdateChallengeUseCaseInput,
  ): Promise<UpdateChallengeUseCaseOutput> {
    const challenge = await this.updateChallengeUseCase.execute(input);
    return challenge;
  }
}
