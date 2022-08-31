import { Status as SubmissionStatus } from 'src/@core/domain/entities/submission';

export interface SubmissionDto {
  id: string;
  challengeId: string;
  repositoryUrl: string;
  createdAt: Date;
  status: SubmissionStatus;
  grade?: number;
}
