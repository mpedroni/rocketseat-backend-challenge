export type Status = 'Pending' | 'Error' | 'Done';

type SubmissionProps = {
  id: string;
  challenge_id?: string;
  repository_url: string;
  createdAt: Date;
  status: Status;
  grade?: number;
};

export class Submission {
  private props: SubmissionProps;

  constructor({
    id,
    challenge_id,
    repository_url,
    createdAt = new Date(),
    status = 'Pending',
    grade = null,
  }: Partial<SubmissionProps>) {
    this.props = {
      id,
      challenge_id,
      createdAt,
      repository_url,
      status,
      grade,
    };
  }

  get id(): string {
    return this.props.id;
  }

  get challenge_id(): string {
    return this.props.challenge_id;
  }

  get repository_url(): string {
    return this.props.repository_url;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get status(): Status {
    return this.props.status;
  }

  get grade(): number | null {
    return this.props.grade;
  }
}
