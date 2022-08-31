import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Submission } from 'src/@domain/entities/submission';
import {
  SubmissionCreateDto,
  SubmissionListFilters,
  SubmissionListOutput,
  SubmissionRepository,
  SubmissionUpdateDto,
} from 'src/@domain/usecases/ports/submission.repository';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PrismaSubmissionRepository implements SubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: SubmissionCreateDto): Promise<Submission> {
    const { id, challengeId, repositoryUrl, created_at, grade, status } = dto;
    const submission = await this.prisma.submission.create({
      data: {
        id,
        challengeId,
        repositoryUrl,
        createdAt: created_at,
        grade,
        status,
      },
    });

    return new Submission({ ...submission });
  }
  find(id: string): Promise<Submission> {
    throw new Error('Method not implemented.');
  }

  async update(dto: SubmissionUpdateDto): Promise<Submission> {
    const { grade, id, status } = dto;
    const submission = await this.prisma.submission.update({
      where: { id },
      data: {
        grade,
        status,
      },
    });

    return new Submission({
      challengeId: submission.challengeId,
      created_at: submission.createdAt,
      grade: submission.grade,
      id: submission.id,
      repositoryUrl: submission.repositoryUrl,
      status: submission.status,
    });
  }

  async list(filters: SubmissionListFilters): Promise<SubmissionListOutput> {
    const { limit = 10, page = 1, query = {} } = filters;
    const { challengeId, date, status } = query;
    const { start, end } = date;
    const createdAtFilter: Prisma.DateTimeFilter = {
      gte: isNaN(Number(start)) ? undefined : start,
      lte: isNaN(Number(end)) ? undefined : end,
    };

    const where: Prisma.SubmissionWhereInput = {
      createdAt: createdAtFilter,
      status,
    };

    if (!!challengeId) where.challengeId = challengeId;

    const submissions = await this.prisma.submission.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.prisma.submission.count({
      where,
    });

    return {
      itemsPerPage: limit,
      page,
      results: submissions.map(
        (submission) =>
          new Submission({ ...submission, created_at: submission.createdAt }),
      ),
      total,
    };
  }
}
