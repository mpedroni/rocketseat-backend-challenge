import { Injectable } from '@nestjs/common';
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
    const { id, challenge_id, repository_url, created_at, grade, status } = dto;
    const submission = await this.prisma.submission.create({
      data: {
        id,
        challenge_id,
        repository_url,
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
    const { grade, id } = dto;
    const submission = await this.prisma.submission.update({
      where: { id },
      data: {
        grade,
        status: 'Done',
      },
    });

    return new Submission({
      challenge_id: submission.challenge_id,
      created_at: submission.createdAt,
      grade: submission.grade,
      id: submission.id,
      repository_url: submission.repository_url,
      status: submission.status,
    });
  }
  list(filters: SubmissionListFilters): Promise<SubmissionListOutput> {
    throw new Error('Method not implemented.');
  }
}
