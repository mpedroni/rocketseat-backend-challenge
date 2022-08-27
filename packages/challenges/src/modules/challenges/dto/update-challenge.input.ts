import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class UpdateChallengeInput {
  @Field()
  @Length(1, 30)
  title: string;

  @Field()
  @Length(1, 255)
  description: string;
}
