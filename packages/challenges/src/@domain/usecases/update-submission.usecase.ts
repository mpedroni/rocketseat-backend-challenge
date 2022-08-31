import { Status as SubmissionStatus } from '../entities/submission';
import { SubmissionRepository } from './ports/submission.repository';
import { UseCase } from './ports/usecase.adapter';

type UpdateSubmissionUseCaseInput = {
  submission_id: string;
  grade: number;
};

type UpdateSubmissionUseCaseOutput = {
  submission_id: string;
  grade: number;
  status: SubmissionStatus;
  challengeId?: string;
  repository_url: string;
  createdAt: Date;
};

export class UpdateSubmissionUseCase
  implements
    UseCase<UpdateSubmissionUseCaseInput, UpdateSubmissionUseCaseOutput>
{
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async execute({
    grade,
    submission_id,
  }: UpdateSubmissionUseCaseInput): Promise<UpdateSubmissionUseCaseOutput> {
    const submission = await this.submissionRepository.update({
      grade,
      status: !!grade || grade === 0 ? 'Done' : 'Error',
      id: submission_id,
    });

    return {
      createdAt: submission.createdAt,
      grade: submission.grade,
      repository_url: submission.repository_url,
      status: submission.status,
      submission_id: submission.id,
      challengeId: submission.challengeId,
    };
  }
}
