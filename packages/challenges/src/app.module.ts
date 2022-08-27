import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ChallengeModule } from './modules/challenges/challenge.module';

@Module({
  imports: [
    ChallengeModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
