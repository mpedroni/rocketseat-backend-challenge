import { Field, InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';

@InputType()
export class CreateChallengeInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field()
  @Length(1, 255)
  description: string;
}
