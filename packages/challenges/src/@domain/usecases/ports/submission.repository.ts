import {
  Status as SubmissionStatus,
  Submission,
} from 'src/@domain/entities/submission';

export type SubmissionCreateDto = {
  id: string;
  challengeId: string;
  repositoryUrl: string;
  createdAt?: Date;
  status?: SubmissionStatus;
  grade?: number;
};

export type SubmissionUpdateDto = {
  id: string;
  grade: number;
  status: SubmissionStatus;
};

export type SubmissionListFilters = {
  limit?: number;
  page?: number;
  query?: SubmissionListQueryFilter;
};

export type SubmissionListQueryFilter = Partial<{
  challengeId: string;
  date: {
    start?: Date;
    end?: Date;
  };
  status: SubmissionStatus;
}>;

export type SubmissionListOutput = {
  results: Submission[];
  page: number;
  itemsPerPage: number;
  total: number;
};

export interface SubmissionRepository {
  create(dto: SubmissionCreateDto): Promise<Submission>;
  find(id: string): Promise<Submission>;
  update(dto: SubmissionUpdateDto): Promise<Submission>;
  list(filters: SubmissionListFilters): Promise<SubmissionListOutput>;
}
