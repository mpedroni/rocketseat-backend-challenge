import { CodeRepositoryUrlValidator } from 'src/@domain/usecases/ports/code-repository-url-validator.adapter';

export class MockedCodeRepositoryUrlValidator
  implements CodeRepositoryUrlValidator
{
  isValid = true;
  async validate(repository_url: string): Promise<boolean> {
    return this.isValid;
  }
}
