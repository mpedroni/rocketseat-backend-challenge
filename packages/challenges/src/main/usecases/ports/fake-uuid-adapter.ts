import { UuidAdapter } from 'src/@domain/usecases/ports/uuid.adapter';

export class FakeUuidAdapter implements UuidAdapter {
  uuid: string;
  constructor(uuid = 'fake-uuid') {
    this.uuid = uuid;
  }

  build(): string {
    return this.uuid;
  }
}
