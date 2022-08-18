import { Challenge } from 'src/@domain/entities/challenge';
import { ChallengeNotFoundError } from 'src/@domain/usecases/errors/challenge-not-found.error';
import {
  ChallengeCreateDto,
  ChallengeRepository,
} from 'src/@domain/usecases/ports/challenge.repository';

export class InMemoryChallengeRepository implements ChallengeRepository {
  private challenges: Challenge[] = [];

  async find(id: string): Promise<Challenge> {
    const challenge = this.challenges.find((challenge) => challenge.id === id);
    if (!challenge) throw new ChallengeNotFoundError();
    return challenge;
  }
  async create(data: ChallengeCreateDto): Promise<Challenge> {
    const { id, title, description } = data;
    const challenge = new Challenge({ id, title, description });
    this.challenges.push(challenge);
    return challenge;
  }
}
