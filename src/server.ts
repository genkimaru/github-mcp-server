import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { availableTools, initializeTools } from './tools'
import { McpRequest, McpResponse } from './types'
import { z } from 'zod'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const githubToken = process.env.GITHUB_TOKEN

if (!githubToken) {
  console.error('GITHUB_TOKEN environment variable is not set.')
  process.exit(1)
}

initializeTools(githubToken) // Initialize GitHubService with the token

app.use(express.json())

// Endpoint to list available tools (MCP discovery)
app.get('/tools', (req: Request, res: Response) => {
  const toolSpecifications = availableTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: {}, // For now, return empty object for schema
  }))
  res.json(toolSpecifications)
})

// Endpoint to invoke a tool (MCP invocation)
app.post('/invoke', async (req: Request<{}, {}, McpRequest>, res: Response<McpResponse>) => {
  const { tool: toolName, parameters } = req.body

  const tool = availableTools.find((t) => t.name === toolName)

  if (!tool) {
    return res.status(404).json({
      tool: toolName,
      success: false,
      error: `Tool "${toolName}" not found.`,
    })
  }

  try {
    // Validate parameters against the tool's schema
    const validatedParams = tool.inputSchema.parse(parameters)

    // This is where you would construct the specific API invocation specification.
    // For our example, let's keep it simple and just show the function call.
    let invocationSpec: any = {}
    if (toolName === 'getPopularRepositories') {
      invocationSpec = {
        api: 'GitHub REST API',
        endpoint: '/search/repositories',
        method: 'GET',
        parameters: {
          q: `stars:>1${validatedParams.language ? ` language:${validatedParams.language}` : ''}`,
          sort: 'stars',
          order: 'desc',
          per_page: validatedParams.count,
        },
        description:
          `Calling GitHub API to search for ${validatedParams.count} most starred repositories` +
          `${validatedParams.language ? ` in ${validatedParams.language}` : ''}.`,
      }
    } else {
      // Fallback for other tools if you add them later
      invocationSpec = {
        api: 'GitHub REST API',
        description: `Invoking tool '${toolName}' with parameters: ${JSON.stringify(
          validatedParams
        )}`,
      }
    }

    const result = await tool.execute(validatedParams)

    res.json({
      tool: toolName,
      success: true,
      data: result,
      invocation_specification: invocationSpec,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        tool: toolName,
        success: false,
        error: `Invalid parameters for tool "${toolName}": ${error.issues
          .map((e: any) => e.message)
          .join(', ')}`,
      })
    }
    console.error(`Error executing tool "${toolName}":`, error)
    res.status(500).json({
      tool: toolName,
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : String(error)}`,
    })
  }
})

app.listen(port, () => {
  console.log(`MCP GitHub Server listening at http://localhost:${port}`)
  console.log(`Tool discovery endpoint: http://localhost:${port}/tools`)
  console.log(`Tool invocation endpoint: http://localhost:${port}/invoke`)
})
