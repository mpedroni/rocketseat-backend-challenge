import {
  ChallengeListOutput,
  ChallengeRepository,
} from '../ports/challenge.repository';
import { UseCase } from '../ports/usecase.adapter';

export type ListChallengesUseCaseInput = {
  limit?: number;
  page?: number;
  query?: {
    title?: string;
    description?: string;
  };
};

export type ListChallengesUseCaseOutput = ChallengeListOutput;

export class ListChallengesUseCase
  implements UseCase<ListChallengesUseCaseInput, ChallengeListOutput>
{
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute({ limit, page, query = {} }: ListChallengesUseCaseInput = {}) {
    return this.challengeRepository.list({ limit, page, query });
  }
}
