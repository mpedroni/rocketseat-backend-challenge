import {
  Submission,
  Status as SubmissionStatus,
} from 'src/@domain/entities/submission';
import { SubmissionNotFoundError } from 'src/@domain/usecases/errors/submission-not-found.error';
import {
  SubmissionCreateDto,
  SubmissionListFilters,
  SubmissionListOutput,
  SubmissionListQueryFilter,
  SubmissionRepository,
  SubmissionUpdateDto,
} from 'src/@domain/usecases/ports/submission.repository';

export class InMemorySubmissionRepository implements SubmissionRepository {
  public submissions: Submission[];

  constructor() {
    this.submissions = [];
  }

  async create({
    id,
    challenge_id,
    created_at,
    repository_url,
    grade,
    status,
  }: SubmissionCreateDto): Promise<Submission> {
    const submission = new Submission({
      id,
      challenge_id,
      created_at,
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

  async update({ id, grade }: SubmissionUpdateDto): Promise<Submission> {
    const submission = await this.find(id);
    submission.grade = grade;
    submission.status = 'Done';
    return submission;
  }

  async list({
    limit = 10,
    page = 1,
    query = {},
  }: SubmissionListFilters): Promise<SubmissionListOutput> {
    const start = limit * page - limit;
    const end = limit * page;
    const filteredSubmissions = await this.filterSubmissions(query);
    const challenges = filteredSubmissions.slice(start, end);
    const total = this.submissions.length;

    return {
      page,
      total,
      itemsPerPage: limit,
      results: challenges,
    };
  }

  private async filterSubmissions({
    challenge_id,
    date = {},
    status,
  }: SubmissionListQueryFilter): Promise<Submission[]> {
    const filteredByChallenge = await this.filterSubmissionsByChallenge(
      challenge_id,
    );
    const filteredByStatus = await this.filterSubmissionsByStatus(
      status,
      filteredByChallenge,
    );
    const filteredSubmissions = await this.filterSubmissionsByDate(
      date,
      filteredByStatus,
    );

    return filteredSubmissions;
  }

  private async filterSubmissionsByChallenge(
    challenge_id: string,
    submissions = this.submissions,
  ): Promise<Submission[]> {
    if (!challenge_id) return submissions;

    return submissions.filter(
      (submission) => submission.challenge_id === challenge_id,
    );
  }

  private async filterSubmissionsByStatus(
    status: SubmissionStatus,
    submissions = this.submissions,
  ): Promise<Submission[]> {
    if (!status) return submissions;
    return submissions.filter((submission) => submission.status === status);
  }

  private async filterSubmissionsByDate(
    date: { start?: Date; end?: Date },
    submissions = this.submissions,
  ): Promise<Submission[]> {
    if (!date.start && !date.end) return submissions;
    const { start = new Date(), end = new Date() } = date;
    return submissions.filter(
      ({ createdAt }) => createdAt >= start && createdAt <= end,
    );
  }
}
