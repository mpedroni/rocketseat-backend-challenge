import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Challenge } from 'src/@domain/entities/challenge';
import { ChallengeNotFoundError } from 'src/@domain/usecases/errors/challenge-not-found.error';
import {
  ChallengeCreateDto,
  ChallengeListFilters,
  ChallengeListOutput,
  ChallengeRepository,
  ChallengeUpdateDto,
} from 'src/@domain/usecases/ports/challenge.repository';
import { PrismaService } from 'src/prisma.service';

function handleError(error: Error): Error {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.NotFoundError
  ) {
    throw new ChallengeNotFoundError();
  }
  throw error;
}

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
    try {
      const challenge = await this.prisma.challenge.findUniqueOrThrow({
        where: { id },
      });

      return new Challenge({ ...challenge });
    } catch (error) {
      handleError(error);
    }
  }

  async list({
    limit = 10,
    page = 1,
    query = {},
  }: ChallengeListFilters): Promise<ChallengeListOutput> {
    const skip = (page - 1) * limit;
    const take = limit;
    const { description, title } = query;
    const where: Prisma.ChallengeWhereInput = {
      description: {
        contains: description,
        mode: 'insensitive',
      },
      title: {
        contains: title,
        mode: 'insensitive',
      },
    };

    const total = await this.prisma.challenge.count({ where });
    const results = await this.prisma.challenge.findMany({
      skip,
      take,
      where,
    });

    return {
      itemsPerPage: limit,
      page,
      results,
      total,
    };
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.challenge.delete({
        where: { id },
      });
    } catch (error) {
      handleError(error);
    }
  }
}
