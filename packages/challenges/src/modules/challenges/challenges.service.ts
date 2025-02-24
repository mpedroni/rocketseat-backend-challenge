import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreateChallengeUseCase,
  CreateChallengeUsecaseInput,
  CreateChallengeUsecaseOutput,
} from 'src/@core/application/usecases/create-challenge.usecase';
import { DeleteChallengeUseCase } from 'src/@core/application/usecases/delete-challenge.usecase';
import {
  ListChallengesUseCase,
  ListChallengesUseCaseInput,
  ListChallengesUseCaseOutput,
} from 'src/@core/application/usecases/list-challenges.usecase';
import {
  ListSubmissionsUseCase,
  ListSubmissionsUseCaseInput,
  ListSubmissionsUseCaseOutput,
} from 'src/@core/application/usecases/list-submissions.usecase';
import {
  RetrieveChallengeUseCase,
  RetrieveChallengeUseCaseOutput,
} from 'src/@core/application/usecases/retrieve-challenge.usecase';
import {
  SubmitChallengeUseCase,
  SubmitChallengeUseCaseInput,
  SubmitChallengeUseCaseOutput,
} from 'src/@core/application/usecases/submit-challenge.usecase';
import {
  UpdateChallengeUseCase,
  UpdateChallengeUseCaseInput,
  UpdateChallengeUseCaseOutput,
} from 'src/@core/application/usecases/update-challenge.usecase';
import { UpdateSubmissionUseCase } from 'src/@core/application/usecases/update-submission.usecase';

interface CorrectLessonMessage {
  submissionId: string;
  repositoryUrl: string;
}
interface CorrectLessonResponse {
  submissionId: string;
  repositoryUrl: string;
  grade: number;
  status: 'Pending' | 'Error' | 'Done';
}

@Injectable()
export class ChallengeService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KafkaService') private readonly client: ClientKafka,
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
    private readonly listChallengesUseCase: ListChallengesUseCase,
    private readonly retrieveChallengeUseCase: RetrieveChallengeUseCase,
    private readonly updateChallengeUseCase: UpdateChallengeUseCase,
    private readonly submitChallengeUseCase: SubmitChallengeUseCase,
    private readonly updateSubmissionUseCase: UpdateSubmissionUseCase,
    private readonly listSubmissionsUseCase: ListSubmissionsUseCase,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf(
      process.env.KAFKA_CHALLENGE_CORRECTION_TOPIC,
    );
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  private correct(message: CorrectLessonMessage): void {
    const observer = this.client.send<CorrectLessonResponse>(
      process.env.KAFKA_CHALLENGE_CORRECTION_TOPIC,
      message,
    );
    observer.subscribe({
      next: (correction: CorrectLessonResponse) => {
        const { submissionId, grade, status } = correction;
        this.updateSubmissionUseCase.execute({
          grade: status === 'Error' ? null : grade,
          submissionId: submissionId,
        });
      },
    });
  }

  async create(
    input: CreateChallengeUsecaseInput,
  ): Promise<CreateChallengeUsecaseOutput> {
    const output = await this.createChallengeUseCase.execute(input);
    return output;
  }

  async delete(id: string): Promise<void> {
    await this.deleteChallengeUseCase.execute(id);
  }

  async list(
    filters: ListChallengesUseCaseInput,
  ): Promise<ListChallengesUseCaseOutput> {
    return await this.listChallengesUseCase.execute(filters);
  }

  async retrieve(id: string): Promise<RetrieveChallengeUseCaseOutput> {
    return await this.retrieveChallengeUseCase.execute(id);
  }

  async update(
    input: UpdateChallengeUseCaseInput,
  ): Promise<UpdateChallengeUseCaseOutput> {
    const challenge = await this.updateChallengeUseCase.execute(input);
    return challenge;
  }

  async submit(
    input: SubmitChallengeUseCaseInput,
  ): Promise<SubmitChallengeUseCaseOutput> {
    const submission = await this.submitChallengeUseCase.execute(input);
    if (submission.status === 'Pending') {
      const { repositoryUrl, id } = submission;
      this.correct({
        submissionId: id,
        repositoryUrl: repositoryUrl,
      });
    }

    return submission;
  }

  async listSubmissions(
    filters: ListSubmissionsUseCaseInput,
  ): Promise<ListSubmissionsUseCaseOutput> {
    return await this.listSubmissionsUseCase.execute(filters);
  }
}
