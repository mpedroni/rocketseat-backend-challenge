export type Status = 'Pending' | 'Error' | 'Done';

type SubmissionProps = {
  id: string;
  challengeId?: string;
  repositoryUrl: string;
  createdAt: Date;
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
    repositoryUrl,
    createdAt = new Date(),
    status = 'Pending',
    grade = null,
  }: Partial<SubmissionProps>) {
    this.props = {
      id,
      challengeId,
      createdAt,
      repositoryUrl,
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

  get repositoryUrl(): string {
    return this.props.repositoryUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
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
