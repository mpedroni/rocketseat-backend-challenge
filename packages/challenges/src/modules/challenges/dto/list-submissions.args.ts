import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Status } from '../models/submission.model';

@InputType()
class DateFilter {
  @Field()
  start: Date;

  @Field()
  end: Date;
}

@ArgsType()
export class ListSubmissionsArgs {
  @Field((type) => Int, { defaultValue: 1, nullable: true })
  @Min(1)
  page?: number;

  @Field((type) => Int, { defaultValue: 10, nullable: true })
  @Min(1)
  limit?: number;

  @Field({ nullable: true })
  challengeId?: string;

  @Field((type) => DateFilter, { nullable: true })
  date?: DateFilter;

  @Field((type) => Status, { nullable: true })
  status?: Status;
}
