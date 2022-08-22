export class InvalidCodeRepositoryError extends Error {
  constructor() {
    super('Invalid code repository');
    this.name = 'InvalidCodeRepositoryError';
  }
}
