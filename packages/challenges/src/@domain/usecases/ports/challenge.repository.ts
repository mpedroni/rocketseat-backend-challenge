import { Challenge } from 'src/@domain/entities/challenge';

export type ChallengeCreateDto = {
  id: string;
  title: string;
  description: string;
};

export type ChallengeUpdateDto = {
  id: string;
  title: string;
  description: string;
};

export type ChallengeListFilters = {
  limit?: number;
  page?: number;
  query?: {
    title?: string;
    description?: string;
  };
};

export type ChallengeListOutput = {
  results: Challenge[];
  page: number;
  itemsPerPage: number;
  total: number;
};

export interface ChallengeRepository {
  create(data: ChallengeCreateDto): Promise<Challenge>;
  find(id: string): Promise<Challenge>;
  exists(id: string): Promise<boolean>;
  update(data: Partial<ChallengeUpdateDto>): Promise<Challenge>;
  delete(id: string): Promise<void>;
  list(filters: ChallengeListFilters): Promise<ChallengeListOutput>;
}
