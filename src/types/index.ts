export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCallInfo[];
}

export interface ToolCallInfo {
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'success' | 'error';
}

export interface SSEEvent {
  type: 'text' | 'tool_call' | 'tool_result' | 'error' | 'done';
  content?: string;
  name?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  error?: string;
}

export interface ChatRequestMessage {
  role: 'user' | 'assistant';
  content: string;
}
