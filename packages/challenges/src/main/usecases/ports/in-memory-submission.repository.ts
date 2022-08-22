import { Submission } from 'src/@domain/entities/submission';
import { SubmissionNotFoundError } from 'src/@domain/usecases/errors/submission-not-found.error';
import {
  SubmissionCreateDto,
  SubmissionRepository,
} from 'src/@domain/usecases/ports/submission.repository';

export class InMemorySubmissionRepository implements SubmissionRepository {
  private submissions: Submission[];

  constructor() {
    this.submissions = [];
  }

  async create({
    id,
    challenge_id,
    repository_url,
    grade,
    status,
  }: SubmissionCreateDto): Promise<Submission> {
    const submission = new Submission({
      id,
      challenge_id,
      repository_url,
      grade,
      status,
    });
    this.submissions.push(submission);

    return submission;
  }

  async find(id: string): Promise<Submission> {
    const submission = this.submissions.find(
      (submission) => submission.id === id,
    );
    if (!submission) throw new SubmissionNotFoundError();

    return submission;
  }
}
