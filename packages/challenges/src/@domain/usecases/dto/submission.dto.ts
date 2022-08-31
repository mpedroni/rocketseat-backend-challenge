import { Status as SubmissionStatus } from 'src/@domain/entities/submission';

export interface SubmissionDto {
  id: string;
  challengeId: string;
  repositoryUrl: string;
  createdAt: Date;
  status: SubmissionStatus;
  grade?: number;
}
