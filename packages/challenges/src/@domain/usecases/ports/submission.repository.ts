import {
  Status as SubmissionStatus,
  Submission,
} from 'src/@domain/entities/submission';

export type SubmissionCreateDto = {
  id: string;
  challenge_id: string;
  repository_url: string;
  status?: SubmissionStatus;
  grade?: number;
};

export interface SubmissionRepository {
  create(dto: SubmissionCreateDto): Promise<Submission>;
  find(id: string): Promise<Submission>;
}
