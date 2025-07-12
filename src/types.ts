import { z } from 'zod'; // For schema validation

// Define the basic structure of an MCP tool
export interface McpTool<TInput extends z.ZodTypeAny, TOutput> {
  name: string;
  description: string;
  inputSchema: TInput;
  // This is the function that the MCP server will call
  // to execute the tool's logic.
  execute: (input: z.infer<TInput>) => Promise<TOutput>;
}

// Basic MCP request and response types (simplified)
export interface McpRequest {
  tool: string;
  parameters: Record<string, any>;
  context?: Record<string, any>; // Optional context from the client
}

export interface McpResponse {
  tool: string;
  success: boolean;
  data?: any;
  error?: string;
  invocation_specification?: any; // This will be the API invocation details
}
