import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Submission } from '../models/submission.model';

@ObjectType()
export class ListSubmissionsOutput {
  @Field((type) => [Submission])
  results: Submission[];

  @Field()
  page: number;

  @Field((type) => Int)
  itemsPerPage: number;

  @Field((type) => Int)
  total: number;
}
