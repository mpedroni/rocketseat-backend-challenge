import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestModule } from './utils/setup';

describe('RemoveChallengeResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to delete a existent Challenge', async () => {
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

    const removeChallengeQuery = `
      mutation RemoveChallenge($id: String!) {
        removeChallenge(id: $id)
      }
    `;
    const id = response.body.data.addChallenge.id;

    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      operationName: 'RemoveChallenge',
      variables: {
        id,
      },
      query: removeChallengeQuery,
    });

    expect(body.data.removeChallenge).toEqual(id);
  });
});
