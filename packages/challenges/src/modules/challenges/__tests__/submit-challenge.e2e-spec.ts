import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestModule } from './utils/setup';

describe('SubmitChallengeResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to submit a existent Challenge', async () => {
    const addChallengeQuery = `
      mutation AddChallenge($input: CreateChallengeInput!) {
        addChallenge(createChallengeInput: $input) {
          id
      }
    }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'AddChallenge',
        variables: {
          input: {
            title: 'Challenge Test',
            description: 'This is a challenge description',
          },
        },
        query: addChallengeQuery,
      });

    const submitChallengeQuery = `
      mutation SubmitChallenge($input: SubmitChallengeInput!) {
        submitChallenge(submitChallengeInput: $input) {
          id
          challengeId
          repository_url
          status
          grade
        }
      }
    `;
    const challengeId = response.body.data.addChallenge.id;
    const input = {
      challengeId,
      repositoryUrl: 'https://github.com/mpedroni/rocketseat-backend-challenge',
    };

    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      operationName: 'SubmitChallenge',
      variables: {
        input,
      },
      query: submitChallengeQuery,
    });

    const data = body.data.submitChallenge;
    expect(data.id).toBeTruthy();
    expect(data.challengeId).toEqual(input.challengeId);
    expect(data.repository_url).toEqual(input.repositoryUrl);
    expect(data.status).toEqual('Pending');
    expect(data.grade).toEqual(null);
  });
});
