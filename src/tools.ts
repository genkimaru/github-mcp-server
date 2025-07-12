import { z } from 'zod'
import { McpTool } from './types'
import { GitHubService } from './githubService'

// Initialize GitHubService (assuming token is loaded from .env)
let githubService: GitHubService

export const initializeTools = (token: string) => {
  githubService = new GitHubService(token)
}

// Tool: Get Popular GitHub Repositories
export const getPopularRepositoriesTool: McpTool<any, any[]> = {
  name: 'getPopularRepositories',
  description:
    'Fetches a specified number of popular GitHub repositories, optionally filtered by language. Useful for finding widely used or trending projects.',
  inputSchema: z.object({
    count: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe('The number of popular repositories to return (default: 10, max: 100).'),
    language: z
      .string()
      .optional()
      .describe('An optional programming language to filter the repositories by.'),
  }),
  execute: async (input) => {
    return githubService.getPopularRepositories(input.count, input.language)
  },
}

// Register all available tools
export const availableTools: McpTool<any, any>[] = [
  getPopularRepositoriesTool,
  // Add other GitHub-related tools here
  // For example:
  // {
  //   name: 'searchRepositoriesByName',
  //   description: 'Searches for GitHub repositories by name, optionally by owner.',
  //   inputSchema: z.object({
  //     query: z.string().describe('The search query for repository names.'),
  //     owner: z.string().optional().describe('Optional: Filter by a specific repository owner.'),
  //   }),
  //   execute: async (input) => {
  //     // Implement GitHubService method for searching by name
  //     return [];
  //   }
  // },
]
