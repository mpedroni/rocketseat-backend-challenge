import { Challenge } from 'src/@domain/entities/challenge';
import { ChallengeIdentifierCollisionError } from 'src/@domain/usecases/errors/challenge-identifier-collision.error';
import { ChallengeNotFoundError } from 'src/@domain/usecases/errors/challenge-not-found.error';
import {
  ChallengeCreateDto,
  ChallengeRepository,
  ChallengeUpdateDto,
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

    if (await this.exists(id)) throw new ChallengeIdentifierCollisionError();

    const challenge = new Challenge({ id, title, description });
    this.challenges.push(challenge);
    return challenge;
  }

  private async exists(id: string) {
    try {
      const challengeExists = !!(await this.find(id));
      return challengeExists;
    } catch (error) {
      if (error instanceof ChallengeNotFoundError) return false;
    }
  }

  async update(data: Partial<ChallengeUpdateDto>): Promise<Challenge> {
    const challenge = await this.find(data.id);
    const { description = challenge.description, title = challenge.title } =
      data;

    const updatedChallenge = Object.assign(challenge, { description, title });
    this.challenges = this.challenges.map((challenge) =>
      challenge.id === updatedChallenge.id ? updatedChallenge : challenge,
    );
    return updatedChallenge;
  }
}
