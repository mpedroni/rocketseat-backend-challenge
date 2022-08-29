import { CodeRepositoryUrlValidator } from 'src/@domain/usecases/ports/code-repository-url-validator.adapter';

type RepositoryData = {
  user: string;
  repo: string;
};

export class GitHubCodeRepositoryUrlValidator
  implements CodeRepositoryUrlValidator
{
  async validate(repository_url: string): Promise<boolean> {
    const userAndRepo = this.getUserAndRepo(repository_url);
    if (!userAndRepo) return false;
    const { user, repo } = userAndRepo;

    const isReachableGitHubRepo = await this.isReachableGitHubRepo(user, repo);
    return isReachableGitHubRepo;
  }

  private getUserAndRepo(repository_url: string): RepositoryData | null {
    const githubUrlRegexPattern = new RegExp(
      /^(http(s)?:\/\/)(github\.com\/)(?<user>\w+)(\/)(?<repo>\w+)(\/)?$/,
    );
    const result = repository_url.match(githubUrlRegexPattern);
    if (!result) return null;

    const { repo, user } = result.groups;

    return {
      repo,
      user,
    };
  }

  private async isReachableGitHubRepo(
    user: string,
    repo: string,
  ): Promise<boolean> {
    const response = await fetch(
      `https://api.github.com/repos/${user}/${repo}`,
    );
    const repository = await response.json();
    return !!repository.id;
  }
}
