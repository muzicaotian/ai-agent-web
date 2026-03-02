import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../../types';
import './MessageList.css';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h2>AI Agent</h2>
          <p>我可以帮你查询天气、进行计算、搜索信息</p>
          <div className="example-prompts">
            <span>试试问：</span>
            <button onClick={() => {}}>北京今天天气怎么样？</button>
            <button onClick={() => {}}>计算 123 * 456</button>
            <button onClick={() => {}}>搜索 TypeScript 教程</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && messages[messages.length - 1]?.content === '' && !messages[messages.length - 1]?.toolCalls?.length && (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
