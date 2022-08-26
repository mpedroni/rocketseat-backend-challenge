import { Injectable } from '@nestjs/common';
import { UuidAdapter } from './@domain/usecases/ports/uuid.adapter';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UuidAdapterV4 implements UuidAdapter {
  build(): string {
    return uuid();
  }
}
