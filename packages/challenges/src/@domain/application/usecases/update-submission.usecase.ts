import { Status as SubmissionStatus } from '../../domain/entities/submission';
import { SubmissionRepository } from './ports/submission.repository';
import { UseCase } from './ports/usecase.adapter';

type UpdateSubmissionUseCaseInput = {
  submissionId: string;
  grade: number;
};

type UpdateSubmissionUseCaseOutput = {
  submissionId: string;
  grade: number;
  status: SubmissionStatus;
  challengeId?: string;
  repositoryUrl: string;
  createdAt: Date;
};

export class UpdateSubmissionUseCase
  implements
    UseCase<UpdateSubmissionUseCaseInput, UpdateSubmissionUseCaseOutput>
{
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async execute({
    grade,
    submissionId,
  }: UpdateSubmissionUseCaseInput): Promise<UpdateSubmissionUseCaseOutput> {
    const submission = await this.submissionRepository.update({
      grade,
      status: !!grade || grade === 0 ? 'Done' : 'Error',
      id: submissionId,
    });

    return {
      createdAt: submission.createdAt,
      grade: submission.grade,
      repositoryUrl: submission.repositoryUrl,
      status: submission.status,
      submissionId: submission.id,
      challengeId: submission.challengeId,
    };
  }
}
