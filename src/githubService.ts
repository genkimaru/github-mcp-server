import { Octokit } from '@octokit/rest'

export class GitHubService {
  private octokit: Octokit
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token })
  }

  // Example GitHub API methods (add more as needed)

  /**
   * Fetches the most popular GitHub repositories.
   * @param {number} count - The number of repositories to fetch.
   * @param {string} language - Optional language filter.
   * @returns {Promise<any[]>} - A list of popular repositories.
   */
  async getPopularRepositories(count: number = 10, language?: string): Promise<any[]> {
    try {
      const q = language ? `stars:>1 language:${language}` : 'stars:>1' // Basic popularity based on stars
      const result = await this.octokit.search.repos({
        q: q,
        sort: 'stars',
        order: 'desc',
        per_page: count,
      })
      return result.data.items.map((repo) => ({
        name: repo.name,
        owner: repo.owner?.login || 'unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        description: repo.description,
        url: repo.html_url,
      }))
    } catch (error) {
      console.error('Error fetching popular repositories:', error)
      throw new Error(
        `Failed to fetch popular repositories: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  // You can add more GitHub API wrappers here, e.g.:
  // async getUserRepositories(username: string): Promise<any[]> { ... }
  // async getRepositoryIssues(owner: string, repo: string): Promise<any[]> { ... }
}
