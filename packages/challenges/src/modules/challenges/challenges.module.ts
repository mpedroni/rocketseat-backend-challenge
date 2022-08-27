import { Module } from '@nestjs/common';
import { CreateChallengeUseCase } from 'src/@domain/usecases/create-challenge.usecase';
import { DeleteChallengeUseCase } from 'src/@domain/usecases/delete-challenge.usecase';
import { ListChallengesUseCase } from 'src/@domain/usecases/list-challenges.usecase';
import { ChallengeRepository } from 'src/@domain/usecases/ports/challenge.repository';
import { UuidAdapter } from 'src/@domain/usecases/ports/uuid.adapter';
import { PrismaChallengeRepository } from 'src/main/usecases/ports/prisma-challenge.repository';
import { PrismaService } from 'src/prisma.service';
import { UuidAdapterV4 } from 'src/uuid.service';
import { ChallengeResolver } from './challenges.resolver';
import { ChallengeService } from './challenges.service';

@Module({
  imports: [],
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
      provide: 'UuidAdapter',
      useClass: UuidAdapterV4,
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
  ],
})
export class ChallengeModule {}
