import { UuidAdapter } from 'src/@domain/application/ports/uuid.adapter';

export class MockedUuidAdapter implements UuidAdapter {
  uuid: string;
  constructor(uuid = 'fake-uuid') {
    this.uuid = uuid;
  }

  build(): string {
    return this.uuid;
  }
}
