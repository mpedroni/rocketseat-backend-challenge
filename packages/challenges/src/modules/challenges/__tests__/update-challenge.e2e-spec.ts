import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestModule } from './utils/setup';

describe('UpdateChallengeResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to update a Challenge', async () => {
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

    const updateChallengeQuery = `
      mutation UpdateChallenge($id: String!, $input: UpdateChallengeInput!) {
        updateChallenge(id: $id, updateChallengeInput: $input) {
          id
          title
          description
        }
      }
    `;
    const id = response.body.data.addChallenge.id;
    const input = {
      title: 'New Challenge Title',
      description: 'New challenge description',
    };

    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      operationName: 'UpdateChallenge',
      variables: {
        id,
        input,
      },
      query: updateChallengeQuery,
    });

    const data = body.data.updateChallenge;

    expect(data.id).toEqual(id);
    expect(data.title).toEqual(input.title);
    expect(data.description).toEqual(input.description);
  });
});
