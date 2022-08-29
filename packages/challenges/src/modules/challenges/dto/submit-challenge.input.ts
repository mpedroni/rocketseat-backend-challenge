import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class SubmitChallengeInput {
  @Field()
  @MinLength(1)
  challengeId: string;

  @Field()
  @MinLength(1)
  repositoryUrl: string;
}
