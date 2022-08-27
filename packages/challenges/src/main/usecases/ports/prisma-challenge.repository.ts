import { Injectable } from '@nestjs/common';
import { Challenge } from 'src/@domain/entities/challenge';
import {
  ChallengeCreateDto,
  ChallengeListFilters,
  ChallengeListOutput,
  ChallengeRepository,
  ChallengeUpdateDto,
} from 'src/@domain/usecases/ports/challenge.repository';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PrismaChallengeRepository implements ChallengeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: ChallengeCreateDto): Promise<Challenge> {
    const { createdAt, description, id, title } =
      await this.prisma.challenge.create({
        data: {
          id: dto.id,
          title: dto.title,
          description: dto.description,
        },
      });

    return new Challenge({ createdAt, description, id, title });
  }

  async exists(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async update(data: Partial<ChallengeUpdateDto>): Promise<Challenge> {
    throw new Error('Method not implemented.');
  }

  async find(id: string): Promise<Challenge> {
    throw new Error('Method not implemented.');
  }

  async list(filters: ChallengeListFilters): Promise<ChallengeListOutput> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
