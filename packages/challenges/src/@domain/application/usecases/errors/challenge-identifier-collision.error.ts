export class ChallengeIdentifierCollisionError extends Error {
  constructor() {
    super('Already exists an challenge with this id');
    this.name = 'ChallengeIdentifierCollisionError';
  }
}
