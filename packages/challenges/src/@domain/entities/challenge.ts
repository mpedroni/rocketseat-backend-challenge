type ChallengeProps = {
  id?: string;
  title: string;
  description: string;
  createdAt?: Date;
};

export class Challenge {
  private props: ChallengeProps;

  constructor({
    id,
    title,
    description,
    createdAt = new Date(),
  }: ChallengeProps) {
    this.props = {
      id,
      description,
      title,
      createdAt,
    };
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
  }

  get description(): string {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
