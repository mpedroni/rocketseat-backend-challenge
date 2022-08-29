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

@ObjectType({ description: 'submission' })
export class Submission {
  @Field((type) => ID)
  id: string;

  @Field({
    nullable: true,
  })
  challenge_id?: string;

  @Field((type) => ChallengeModel)
  challenge?: ChallengeModel;

  @Field({
    nullable: true,
  })
  repository_url?: string;

  @Field()
  createdAt: Date;

  @Field((type) => Status)
  status: Status;

  @Field({
    nullable: true,
  })
  grade: number;
}
