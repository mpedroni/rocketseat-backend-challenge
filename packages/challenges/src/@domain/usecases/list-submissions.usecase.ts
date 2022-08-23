import {
  SubmissionListOutput,
  SubmissionListQueryFilter,
  SubmissionRepository,
} from './ports/submission.repository';
import { UseCase } from './ports/usecase.adapter';

type ListSubmissionsUseCaseInput = {
  limit?: number;
  page?: number;
  query?: SubmissionListQueryFilter;
};

type ListSubmissionsUseCaseOutput = SubmissionListOutput;

export class ListSubmissionsUseCase
  implements UseCase<ListSubmissionsUseCaseInput, ListSubmissionsUseCaseOutput>
{
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  execute({
    limit,
    page,
    query,
  }: ListSubmissionsUseCaseInput = {}): Promise<ListSubmissionsUseCaseOutput> {
    return this.submissionRepository.list({ limit, page, query });
  }
}
