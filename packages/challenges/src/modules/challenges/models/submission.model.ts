import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Challenge as ChallengeModel } from './challenge.model';

export enum Status {
  Pending,
  Done,
  Error,
}

registerEnumType(Status, {
  name: 'SubmissionStatus',
});

@ObjectType({ description: 'Represent the Submission domain entity' })
export class Submission {
  @Field((type) => ID)
  id: string;

  @Field({
    nullable: true,
  })
  challengeId?: string;

  @Field((type) => ChallengeModel)
  challenge?: ChallengeModel;

  @Field({
    nullable: true,
  })
  repositoryUrl?: string;

  @Field()
  createdAt: Date;

  @Field((type) => Status)
  status: Status;

  @Field({
    nullable: true,
  })
  grade: number;
}
