import {
  Submission,
  Status as SubmissionStatus,
} from 'src/@core/domain/entities/submission';
import { SubmissionNotFoundError } from 'src/@core/application/errors/submission-not-found.error';
import {
  SubmissionCreateDto,
  SubmissionListFilters,
  SubmissionListOutput,
  SubmissionListQueryFilter,
  SubmissionRepository,
  SubmissionUpdateDto,
} from 'src/@core/application/ports/submission.repository';

export class InMemorySubmissionRepository implements SubmissionRepository {
  private submissions: Submission[];

  constructor() {
    this.submissions = [];
  }

  async create({
    id,
    challengeId,
    createdAt,
    repositoryUrl,
    grade,
    status,
  }: SubmissionCreateDto): Promise<Submission> {
    const submission = new Submission({
      id,
      challengeId,
      createdAt,
      repositoryUrl,
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

  async update({
    id,
    grade,
    status,
  }: SubmissionUpdateDto): Promise<Submission> {
    const submission = await this.find(id);
    submission.grade = grade;
    submission.status = status;
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
    challengeId,
    date = {},
    status,
  }: SubmissionListQueryFilter): Promise<Submission[]> {
    const filteredByChallenge = await this.filterSubmissionsByChallenge(
      challengeId,
      this.submissions,
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
    challengeId: string,
    submissions: Submission[],
  ): Promise<Submission[]> {
    if (!challengeId) return submissions;

    return submissions.filter(
      (submission) => submission.challengeId === challengeId,
    );
  }

  private async filterSubmissionsByStatus(
    status: SubmissionStatus,
    submissions: Submission[],
  ): Promise<Submission[]> {
    if (!status) return submissions;
    return submissions.filter((submission) => submission.status === status);
  }

  private async filterSubmissionsByDate(
    date: { start?: Date; end?: Date },
    submissions: Submission[],
  ): Promise<Submission[]> {
    if (!date.start && !date.end) return submissions;
    const { start = new Date(), end = new Date() } = date;
    return submissions.filter(
      ({ createdAt }) => createdAt >= start && createdAt <= end,
    );
  }
}
