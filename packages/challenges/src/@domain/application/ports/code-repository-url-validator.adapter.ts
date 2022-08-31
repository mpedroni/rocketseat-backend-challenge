export interface CodeRepositoryUrlValidator {
  validate(repositoryUrl: string): Promise<boolean>;
}
