import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { useChat } from '../../hooks/useChat';
import './ChatContainer.css';

export function ChatContainer() {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Agent</h1>
        {messages.length > 0 && (
          <button className="clear-button" onClick={clearMessages}>
            清空对话
          </button>
        )}
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <InputArea onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
