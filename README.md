# GitHub MCP Server

A Model Context Protocol (MCP) server that provides GitHub-related tools and functionality. This server allows you to interact with GitHub's API through a standardized MCP interface, making it easy to fetch popular repositories, search for projects, and more.

## Features

- **Popular Repository Discovery**: Fetch the most popular GitHub repositories with optional language filtering
- **MCP Protocol Compliance**: Implements the Model Context Protocol for standardized tool interactions
- **TypeScript Support**: Built with TypeScript for type safety and better development experience
- **Express.js Backend**: Fast and reliable HTTP server using Express.js
- **GitHub API Integration**: Seamless integration with GitHub's REST API using Octokit

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub Personal Access Token

## Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd github-mcp-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```bash
   GITHUB_TOKEN=your_github_personal_access_token_here
   PORT=3000
   ```

   **Note**: You'll need to create a GitHub Personal Access Token:

   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with appropriate permissions (public_repo scope is sufficient for this project)
   - Copy the token and paste it in your `.env` file

4. **Build the project (optional)**
   ```bash
   npm run build
   ```

## Usage

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Mode

Build and start the production server:

```bash
npm run build
npm start
```

## API Endpoints

### 1. Tool Discovery

**GET** `/tools`

Returns a list of available tools and their specifications.

**Response:**

```json
[
  {
    "name": "getPopularRepositories",
    "description": "Fetches a specified number of popular GitHub repositories, optionally filtered by language. Useful for finding widely used or trending projects.",
    "inputSchema": {}
  }
]
```

### 2. Tool Invocation

**POST** `/invoke`

Execute a specific tool with parameters.

**Request Body:**

```json
{
  "tool": "getPopularRepositories",
  "parameters": {
    "count": 10,
    "language": "javascript"
  }
}
```

**Response:**

```json
{
  "tool": "getPopularRepositories",
  "success": true,
  "data": [
    {
      "name": "repository-name",
      "owner": "owner-name",
      "stars": 1000,
      "forks": 500,
      "description": "Repository description",
      "url": "https://github.com/owner/repository"
    }
  ],
  "invocation_specification": {
    "api": "GitHub REST API",
    "endpoint": "/search/repositories",
    "method": "GET",
    "parameters": {
      "q": "stars:>1 language:javascript",
      "sort": "stars",
      "order": "desc",
      "per_page": 10
    },
    "description": "Calling GitHub API to search for 10 most starred repositories in javascript."
  }
}
```

## Available Tools

### getPopularRepositories

Fetches popular GitHub repositories based on star count.

**Parameters:**

- `count` (number, optional): Number of repositories to return (default: 10, max: 100)
- `language` (string, optional): Filter repositories by programming language

**Example:**

```bash
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "getPopularRepositories",
    "parameters": {
      "count": 5,
      "language": "python"
    }
  }'
```

## Project Structure

```
github-mcp-server/
├── src/
│   ├── server.ts          # Main Express server
│   ├── tools.ts           # Tool definitions and registration
│   ├── types.ts           # TypeScript type definitions
│   └── githubService.ts   # GitHub API service
├── package.json
├── tsconfig.json
├── .env                   # Environment variables (create this)
└── README.md
```

## Development

### Adding New Tools

To add a new GitHub-related tool:

1. **Define the tool schema** in `src/tools.ts`:

   ```typescript
   export const newTool: McpTool<any, any[]> = {
     name: 'newToolName',
     description: 'Description of what this tool does',
     inputSchema: z.object({
       // Define your input parameters
       param1: z.string().describe('Description of param1'),
       param2: z.number().optional().describe('Optional param2'),
     }),
     execute: async (input) => {
       // Implement your tool logic
       return await githubService.yourMethod(input.param1, input.param2)
     },
   }
   ```

2. **Add the tool to the available tools array**:

   ```typescript
   export const availableTools: McpTool<any, any>[] = [
     getPopularRepositoriesTool,
     newTool, // Add your new tool here
   ]
   ```

3. **Implement the corresponding method** in `src/githubService.ts` if needed.

### Environment Variables

| Variable       | Description                  | Required |
| -------------- | ---------------------------- | -------- |
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes      |
| `PORT`         | Server port (default: 3000)  | No       |

## Error Handling

The server provides comprehensive error handling:

- **400 Bad Request**: Invalid parameters (with detailed validation errors)
- **404 Not Found**: Tool not found
- **500 Internal Server Error**: Server-side errors (with error details)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Troubleshooting

### Common Issues

1. **"Bad credentials" error**

   - Ensure your GitHub token is valid and has the correct permissions
   - Check that the token is properly set in your `.env` file

2. **Port already in use**

   - Change the `PORT` in your `.env` file
   - Or kill the process using the current port

3. **TypeScript compilation errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that your TypeScript version is compatible

### Getting Help

If you encounter any issues:

1. Check the console output for error messages
2. Verify your environment variables are set correctly
3. Ensure your GitHub token has the necessary permissions
4. Check the GitHub API rate limits if you're making many requests

## Related Links

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Octokit.js](https://octokit.github.io/rest.js/)
- [Express.js](https://expressjs.com/)
- [Zod](https://zod.dev/)
