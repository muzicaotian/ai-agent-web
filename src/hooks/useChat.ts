import { useState, useCallback } from 'react';
import { streamChat } from '../services/api';
import type { Message, SSEEvent, ToolCallInfo } from '../types';

let messageIdCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      toolCalls: [],
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const chatMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const stream = streamChat(chatMessages);
      let currentToolCall: ToolCallInfo | null = null;

      for await (const data of stream) {
        if (data === '[DONE]') break;

        try {
          const event: SSEEvent = JSON.parse(data);

          switch (event.type) {
            case 'text':
              if (event.content) {
                setMessages(prev => {
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg?.role === 'assistant') {
                    return prev.map((msg, index) =>
                      index === prev.length - 1
                        ? { ...msg, content: msg.content + event.content }
                        : msg
                    );
                  }
                  return prev;
                });
              }
              break;

            case 'tool_call':
              currentToolCall = {
                name: event.name || '',
                args: event.args || {},
                status: 'pending',
              };
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === 'assistant') {
                  return prev.map((msg, index) =>
                    index === prev.length - 1
                      ? { ...msg, toolCalls: [...(msg.toolCalls || []), currentToolCall!] }
                      : msg
                  );
                }
                return prev;
              });
              break;

            case 'tool_result':
              if (currentToolCall && event.name) {
                setMessages(prev => {
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg?.role === 'assistant' && lastMsg.toolCalls) {
                    return prev.map((msg, index) =>
                      index === prev.length - 1
                        ? {
                            ...msg,
                            toolCalls: msg.toolCalls!.map(tc =>
                              tc.name === event.name
                                ? { ...tc, result: event.result, status: 'success' as const }
                                : tc
                            ),
                          }
                        : msg
                    );
                  }
                  return prev;
                });
                currentToolCall = null;
              }
              break;

            case 'error':
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === 'assistant') {
                  return prev.map((msg, index) =>
                    index === prev.length - 1
                      ? { ...msg, content: msg.content + `\n\n错误: ${event.error}` }
                      : msg
                  );
                }
                return prev;
              });
              break;

            case 'done':
              break;
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
    } catch (error) {
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === 'assistant') {
          return prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, content: `发生错误: ${error instanceof Error ? error.message : 'Unknown error'}` }
              : msg
          );
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
