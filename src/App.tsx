import { useState } from 'react';
import { ChatContainer } from './components/Chat/ChatContainer';
import { PerformanceRadar } from './components/PerformanceRadar/PerformanceRadar';
import './styles/index.css';

function App() {
  const [page, setPage] = useState<'chat' | 'radar'>('chat');

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 1000,
          display: 'flex',
          gap: 8,
          padding: 6,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid #e5e7eb',
        }}
      >
        <button
          type="button"
          onClick={() => setPage('chat')}
          style={{
            border: 0,
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            background: page === 'chat' ? '#111827' : '#f3f4f6',
            color: page === 'chat' ? '#fff' : '#111827',
            fontWeight: 600,
          }}
        >
          Chat
        </button>
        <button
          type="button"
          onClick={() => setPage('radar')}
          style={{
            border: 0,
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            background: page === 'radar' ? '#111827' : '#f3f4f6',
            color: page === 'radar' ? '#fff' : '#111827',
            fontWeight: 600,
          }}
        >
          Performance Radar
        </button>
      </div>

      {page === 'chat' ? <ChatContainer /> : <PerformanceRadar />}
    </>
  );
}

export default App;
