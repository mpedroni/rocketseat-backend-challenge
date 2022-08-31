import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Challenge } from 'src/@core/domain/entities/challenge';
import { ChallengeNotFoundError } from 'src/@core/application/errors/challenge-not-found.error';
import {
  ChallengeCreateDto,
  ChallengeListFilters,
  ChallengeListOutput,
  ChallengeRepository,
  ChallengeUpdateDto,
} from 'src/@core/application/ports/challenge.repository';
import { PrismaService } from 'src/services/prisma.service';

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
    const challenge = await this.prisma.challenge.findFirst({
      where: { id },
    });

    return !!challenge;
  }

  async update(data: ChallengeUpdateDto): Promise<Challenge> {
    const { id, description, title } = data;

    if (!(await this.exists(id))) throw new ChallengeNotFoundError();

    const challenge = await this.prisma.challenge.update({
      where: {
        id,
      },
      data: {
        description,
        title,
      },
    });

    return new Challenge({ ...challenge });
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
