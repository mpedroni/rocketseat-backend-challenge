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
} from 'src/@domain/usecases/create-challenge.usecase';
import { DeleteChallengeUseCase } from 'src/@domain/usecases/delete-challenge.usecase';
import {
  ListChallengesUseCase,
  ListChallengesUseCaseInput,
  ListChallengesUseCaseOutput,
} from 'src/@domain/usecases/list-challenges.usecase';
import {
  RetrieveChallengeUseCase,
  RetrieveChallengeUseCaseOutput,
} from 'src/@domain/usecases/retrieve-challenge.usecase';
import {
  SubmitChallengeUseCase,
  SubmitChallengeUseCaseInput,
  SubmitChallengeUseCaseOutput,
} from 'src/@domain/usecases/submit-challenge.usecase';
import {
  UpdateChallengeUseCase,
  UpdateChallengeUseCaseInput,
  UpdateChallengeUseCaseOutput,
} from 'src/@domain/usecases/update-challenge.usecase';
import { UpdateSubmissionUseCase } from 'src/@domain/usecases/update-submission.usecase';

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
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  correct(message: CorrectLessonMessage): void {
    const observer = this.client.send<CorrectLessonResponse>(
      'challenge.correction',
      message,
    );
    observer.subscribe({
      next: (correction: CorrectLessonResponse) => {
        const { submissionId, grade, status } = correction;
        this.updateSubmissionUseCase.execute({
          grade,
          submission_id: submissionId,
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
      const { repository_url, id } = submission;
      this.correct({
        submissionId: id,
        repositoryUrl: repository_url,
      });
    }

    return submission;
  }
}
