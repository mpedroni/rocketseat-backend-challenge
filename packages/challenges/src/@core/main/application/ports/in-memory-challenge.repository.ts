import { Challenge } from 'src/@core/domain/entities/challenge';
import { ChallengeIdentifierCollisionError } from 'src/@core/application/errors/challenge-identifier-collision.error';
import { ChallengeNotFoundError } from 'src/@core/application/errors/challenge-not-found.error';
import {
  ChallengeCreateDto,
  ChallengeListFilters,
  ChallengeListOutput,
  ChallengeRepository,
  ChallengeUpdateDto,
} from 'src/@core/application/ports/challenge.repository';

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

  async exists(id: string) {
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
    const challengeIndex = this.challenges.findIndex(
      (challenge) => challenge.id === updatedChallenge.id,
    );
    this.challenges = this.challenges.splice(
      challengeIndex,
      1,
      updatedChallenge,
    );
    return updatedChallenge;
  }

  async delete(id: string): Promise<void> {
    if (!(await this.exists(id))) throw new ChallengeNotFoundError();
    this.challenges = this.challenges.filter(
      (challenge) => challenge.id !== id,
    );
  }

  async list({
    limit = 10,
    page = 1,
    query,
  }: ChallengeListFilters): Promise<ChallengeListOutput> {
    const start = limit * page - limit;
    const end = limit * page;
    const filteredChallenges = this.filterChallenges(query);
    const challenges = filteredChallenges.slice(start, end);
    const total = this.challenges.length;

    return {
      page,
      total,
      itemsPerPage: limit,
      results: challenges,
    };
  }

  private filterChallenges(query: { title?: string; description?: string }) {
    let { description = '', title = '' } = query;
    description = description.toLowerCase();
    title = title.toLowerCase();
    return this.challenges.filter(
      (challenge) =>
        challenge.description.toLowerCase().includes(description) &&
        challenge.title.toLowerCase().includes(title),
    );
  }
}
