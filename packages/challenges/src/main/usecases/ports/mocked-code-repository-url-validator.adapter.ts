import { CodeRepositoryUrlValidator } from 'src/@domain/application/ports/code-repository-url-validator.adapter';

export class MockedCodeRepositoryUrlValidator
  implements CodeRepositoryUrlValidator
{
  isValid = true;
  async validate(repositoryUrl: string): Promise<boolean> {
    return this.isValid;
  }
}
