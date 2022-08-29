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
  update(dto: SubmissionUpdateDto): Promise<Submission> {
    throw new Error('Method not implemented.');
  }
  list(filters: SubmissionListFilters): Promise<SubmissionListOutput> {
    throw new Error('Method not implemented.');
  }
}
