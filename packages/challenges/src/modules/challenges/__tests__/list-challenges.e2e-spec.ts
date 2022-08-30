import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestModule } from './utils/setup';

describe('ChallengesResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the created Challenges', async () => {
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

    const challenges = [
      {
        title: 'Challenge Test',
        description: 'This is a challenge description',
      },
      {
        title: 'Another Challenge Test',
        description: 'This is another challenge description',
      },
    ];

    const challengesIds: string[] = [];
    for (const challenge of challenges) {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: 'AddChallenge',
          variables: {
            input: challenge,
          },
          query: addChallengeQuery,
        });

      challengesIds.push(body.data.addChallenge.id);
    }

    const listChallengesQuery = `
      query Challenges {
        challenges {
          results {
            id
          }
          total
        }
      }
    `;

    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      operationName: 'Challenges',
      query: listChallengesQuery,
    });

    const data = body.data.challenges;

    expect(data.total).toEqual(2);
    expect(data.results.map((challenge) => challenge.id)).toEqual(
      challengesIds,
    );
  });
});
