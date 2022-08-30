import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestModule } from './utils/setup';

describe('AddChallengeResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a Challenge', async () => {
    const query = `
      mutation AddChallenge($input: CreateChallengeInput!) {
        addChallenge(createChallengeInput: $input) {
          id
          title
          description
          createdAt
        }
      }
    `;
    const input = {
      title: 'Challenge Test',
      description: 'This is a challenge description',
    };

    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      operationName: 'AddChallenge',
      variables: {
        input,
      },
      query,
    });

    const data = body.data.addChallenge;

    expect(data.title).toEqual(input.title);
    expect(data.description).toEqual(input.description);
    expect(data.id).toBeTruthy();
    expect(data.createdAt).toBeTruthy();
  });
});
