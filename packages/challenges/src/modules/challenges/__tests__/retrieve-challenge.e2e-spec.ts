import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestModule } from './utils/setup';

describe('ChallengeResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a Challenge', async () => {
    const addChallengeQuery = `
      mutation AddChallenge($input: CreateChallengeInput!) {
        addChallenge(createChallengeInput: $input) {
          id
          title
          description
          createdAt
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

    const retrieveChallengeQuery = `
      query Challenge($id: String!) {
        challenge(id: $id) {
          id
        }
      }
    `;
    const id = response.body.data.addChallenge.id;

    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      operationName: 'Challenge',
      variables: {
        id,
      },
      query: retrieveChallengeQuery,
    });

    expect(body.data.challenge.id).toEqual(id);
  });
});
