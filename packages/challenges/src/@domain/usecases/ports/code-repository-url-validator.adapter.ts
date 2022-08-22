export interface CodeRepositoryUrlValidator {
  validate(repository_url: string): Promise<boolean>;
}
