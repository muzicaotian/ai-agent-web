# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build

## Architecture

This is a React + TypeScript + Vite chat interface for an AI Agent backend.

### Data Flow

The application uses a streaming SSE-based communication pattern:

1. **API Layer** (`src/services/api.ts`): Communicates with backend at `VITE_API_URL` (default: `http://localhost:3001`). The `streamChat()` function returns an async generator that yields SSE events from `/api/agent/chat`.

2. **State Management** (`src/hooks/useChat.ts`): A custom React hook that manages message state and handles the streaming protocol. It processes SSE events of types: `text`, `tool_call`, `tool_result`, `error`, `done`. Messages are appended in real-time as chunks arrive from the stream.

3. **Component Hierarchy**:
   - `App` → `ChatContainer` → `MessageList` + `InputArea`
   - `MessageList` → `MessageBubble` → `ToolCallCard` (for tool calls)

### Key Types

- `Message`: Core message type with `role`, `content`, and optional `toolCalls[]`
- `ToolCallInfo`: Represents a tool invocation with `name`, `args`, `result`, and `status`
- `SSEEvent`: Server-sent event types for the streaming protocol

### Tool Call System

The UI displays tool calls inline within assistant messages. Tool calls go through states: `pending` → `success`/`error`. The `ToolCallCard` component renders tool arguments and results with icons mapped to known tool names (weather, calculator, web search, and various Playwright browser actions).

### Environment Variables

- `VITE_API_URL` - Backend API base URL
