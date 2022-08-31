export type Status = 'Pending' | 'Error' | 'Done';

type SubmissionProps = {
  id: string;
  challengeId?: string;
  repository_url: string;
  created_at: Date;
  status: Status;
  grade?: number;
};

export class InvalidSubmissionGradeError extends Error {
  constructor() {
    super("The Submission's grade must be between 0 and 10");
    this.name = 'InvalidSubmissionGradeError';
  }
}

export class Submission {
  private props: SubmissionProps;

  constructor({
    id,
    challengeId,
    repository_url,
    created_at = new Date(),
    status = 'Pending',
    grade = null,
  }: Partial<SubmissionProps>) {
    this.props = {
      id,
      challengeId,
      created_at,
      repository_url,
      status,
      grade,
    };
  }

  get id(): string {
    return this.props.id;
  }

  get challengeId(): string {
    return this.props.challengeId;
  }

  get repository_url(): string {
    return this.props.repository_url;
  }

  get createdAt(): Date {
    return this.props.created_at;
  }

  get status(): Status {
    return this.props.status;
  }

  set status(status: Status) {
    this.props.status = status;
  }

  get grade(): number | null {
    return this.props.grade;
  }

  set grade(grade: number) {
    if (grade < 0 || grade > 10) throw new InvalidSubmissionGradeError();
    this.props.grade = grade;
  }
}
