import {
  Status as SubmissionStatus,
  Submission,
} from 'src/@core/domain/entities/submission';
import { SubmissionDto } from '../usecases/dto/submission.dto';

export type SubmissionCreateDto = SubmissionDto;

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
  update(dto: SubmissionUpdateDto): Promise<Submission>;
  list(filters: SubmissionListFilters): Promise<SubmissionListOutput>;
}
