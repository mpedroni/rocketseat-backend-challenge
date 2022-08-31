import { Status as SubmissionStatus } from 'src/@domain/entities/submission';

export interface SubmissionDto {
  id: string;
  challengeId: string;
  repository_url: string;
  createdAt: Date;
  status: SubmissionStatus;
  grade?: number;
}
