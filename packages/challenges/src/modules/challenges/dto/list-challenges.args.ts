import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ListChallengesArgs {
  @Field((type) => Int, { defaultValue: 1, nullable: true })
  page?: number;

  @Field((type) => Int, { defaultValue: 10, nullable: true })
  limit?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}
