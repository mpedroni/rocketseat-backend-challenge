import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'challenge' })
export class Challenge {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;
}
