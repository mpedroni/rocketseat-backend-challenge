import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Challenge } from '../models/challenge.model';

@ObjectType()
export class ListChallengesOutput {
  @Field((type) => [Challenge])
  results: Challenge[];

  @Field()
  page: number;

  @Field((type) => Int)
  itemsPerPage: number;

  @Field((type) => Int)
  total: number;
}
