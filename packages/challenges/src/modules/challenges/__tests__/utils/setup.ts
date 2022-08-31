import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { InMemoryChallengeRepository } from 'src/@core/main/application/ports/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from 'src/@core/main/application/ports/in-memory-submission.repository';
import { ChallengeModule } from '../../challenges.module';

const mockedKafkaService = {
  connect: jest.fn(),
  emit: jest.fn(),
  close: jest.fn(),
  subscribeToResponseOf: jest.fn(),
  send: jest.fn(() => ({
    subscribe: jest.fn(),
  })),
};

export async function createTestModule() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule, ChallengeModule],
  })
    .overrideProvider('ChallengeRepository')
    .useClass(InMemoryChallengeRepository)
    .overrideProvider('SubmissionRepository')
    .useClass(InMemorySubmissionRepository)
    .overrideProvider('KafkaService')
    .useValue(mockedKafkaService)
    .compile();

  const app = moduleRef.createNestApplication();
  return app;
}
