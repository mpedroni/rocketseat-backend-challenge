import { Status as SubmissionStatus } from 'src/@core/domain/entities/submission';
import { Status as SubmissionStatusModel } from '../models/submission.model';

export function domainToGraphQLSubmissionStatus(
  s: SubmissionStatus,
): SubmissionStatusModel {
  const status: Record<SubmissionStatus, SubmissionStatusModel> = {
    Done: SubmissionStatusModel.Done,
    Pending: SubmissionStatusModel.Pending,
    Error: SubmissionStatusModel.Error,
  };

  return status[s];
}

export function graphQlToDomainSubmissionStatus(
  s: SubmissionStatusModel,
): SubmissionStatus {
  const status: Record<SubmissionStatusModel, SubmissionStatus> = {
    [SubmissionStatusModel.Done]: 'Done',
    [SubmissionStatusModel.Pending]: 'Pending',
    [SubmissionStatusModel.Error]: 'Error',
  };

  return status[s];
}
