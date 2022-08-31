import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateChallengeUseCase } from 'src/@core/application/usecases/create-challenge.usecase';
import { DeleteChallengeUseCase } from 'src/@core/application/usecases/delete-challenge.usecase';
import { ListChallengesUseCase } from 'src/@core/application/usecases/list-challenges.usecase';
import { ListSubmissionsUseCase } from 'src/@core/application/usecases/list-submissions.usecase';
import { ChallengeRepository } from 'src/@core/application/ports/challenge.repository';
import { CodeRepositoryUrlValidator } from 'src/@core/application/ports/code-repository-url-validator.adapter';
import { SubmissionRepository } from 'src/@core/application/ports/submission.repository';
import { UuidAdapter } from 'src/@core/application/ports/uuid.adapter';
import { RetrieveChallengeUseCase } from 'src/@core/application/usecases/retrieve-challenge.usecase';
import { SubmitChallengeUseCase } from 'src/@core/application/usecases/submit-challenge.usecase';
import { UpdateChallengeUseCase } from 'src/@core/application/usecases/update-challenge.usecase';
import { UpdateSubmissionUseCase } from 'src/@core/application/usecases/update-submission.usecase';
import { GitHubCodeRepositoryUrlValidator } from 'src/@core/main/application/ports/github-code-repository-url-validator.adapter';
import { PrismaChallengeRepository } from 'src/@core/main/application/ports/prisma-challenge.repository';
import { PrismaSubmissionRepository } from 'src/@core/main/application/ports/prisma-submission.repository';
import { PrismaService } from 'src/services/prisma.service';
import { UuidAdapterV4 } from 'src/@core/main/application/ports/uuid.adapter';
import { ChallengeResolver } from './challenges.resolver';
import { ChallengeService } from './challenges.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KafkaService',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID || 'challenges-service',
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [
    ChallengeResolver,
    ChallengeService,
    PrismaService,
    {
      provide: 'ChallengeRepository',
      useClass: PrismaChallengeRepository,
    },
    {
      provide: 'SubmissionRepository',
      useClass: PrismaSubmissionRepository,
    },
    {
      provide: 'UuidAdapter',
      useClass: UuidAdapterV4,
    },
    {
      provide: 'CodeRepositoryUrlValidator',
      useClass: GitHubCodeRepositoryUrlValidator,
    },
    {
      provide: CreateChallengeUseCase,
      useFactory: (
        challengeRepository: ChallengeRepository,
        uuidAdapter: UuidAdapter,
      ) => {
        return new CreateChallengeUseCase(challengeRepository, uuidAdapter);
      },
      inject: ['ChallengeRepository', 'UuidAdapter'],
    },
    {
      provide: DeleteChallengeUseCase,
      useFactory: (challengeRepository: ChallengeRepository) => {
        return new DeleteChallengeUseCase(challengeRepository);
      },
      inject: ['ChallengeRepository'],
    },
    {
      provide: ListChallengesUseCase,
      useFactory: (challengeRepository: ChallengeRepository) => {
        return new ListChallengesUseCase(challengeRepository);
      },
      inject: ['ChallengeRepository'],
    },
    {
      provide: RetrieveChallengeUseCase,
      useFactory: (challengeRepository: ChallengeRepository) => {
        return new RetrieveChallengeUseCase(challengeRepository);
      },
      inject: ['ChallengeRepository'],
    },
    {
      provide: UpdateChallengeUseCase,
      useFactory: (challengeRepository: ChallengeRepository) => {
        return new UpdateChallengeUseCase(challengeRepository);
      },
      inject: ['ChallengeRepository'],
    },
    {
      provide: SubmitChallengeUseCase,
      useFactory: (
        submissionRepository: SubmissionRepository,
        challengeRepository: ChallengeRepository,
        codeRepositoryUrlValidator: CodeRepositoryUrlValidator,
        uuidAdapter: UuidAdapter,
      ) => {
        return new SubmitChallengeUseCase(
          submissionRepository,
          challengeRepository,
          codeRepositoryUrlValidator,
          uuidAdapter,
        );
      },
      inject: [
        'SubmissionRepository',
        'ChallengeRepository',
        'CodeRepositoryUrlValidator',
        'UuidAdapter',
      ],
    },
    {
      provide: UpdateSubmissionUseCase,
      useFactory: (submissionRepository: SubmissionRepository) => {
        return new UpdateSubmissionUseCase(submissionRepository);
      },
      inject: ['SubmissionRepository'],
    },
    {
      provide: ListSubmissionsUseCase,
      useFactory: (submissionRepository: SubmissionRepository) => {
        return new ListSubmissionsUseCase(submissionRepository);
      },
      inject: ['SubmissionRepository'],
    },
  ],
})
export class ChallengeModule {}
