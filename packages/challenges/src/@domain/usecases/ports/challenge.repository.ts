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

export interface ChallengeRepository {
  create(data: ChallengeCreateDto): Promise<Challenge>;
  find(id: string): Promise<Challenge>;
  update(data: Partial<ChallengeUpdateDto>): Promise<Challenge>;
}
