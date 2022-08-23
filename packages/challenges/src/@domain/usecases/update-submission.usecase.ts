import { Status as SubmissionStatus } from '../entities/submission';
import { SubmissionRepository } from './ports/submission.repository';

type UpdateSubmissionUseCaseInput = {
  submission_id: string;
  grade: number;
};

type UpdateSubmissionUseCaseOutput = {
  submission_id: string;
  grade: number;
  status: SubmissionStatus;
  challenge_id?: string;
  repository_url: string;
  createdAt: Date;
};

export class UpdateSubmissionUseCase {
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async execute({
    grade,
    submission_id,
  }: UpdateSubmissionUseCaseInput): Promise<UpdateSubmissionUseCaseOutput> {
    const submission = await this.submissionRepository.update({
      grade,
      id: submission_id,
    });

    return {
      createdAt: submission.createdAt,
      grade: submission.grade,
      repository_url: submission.repository_url,
      status: submission.status,
      submission_id: submission.id,
      challenge_id: submission.challenge_id,
    };
  }
}
