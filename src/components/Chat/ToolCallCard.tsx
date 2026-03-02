import type { ToolCallInfo } from '../../types';
import './ToolCallCard.css';

interface ToolCallCardProps {
  toolCall: ToolCallInfo;
}

const toolIcons: Record<string, string> = {
  get_weather: '🌤️',
  calculate: '🔢',
  web_search: '🔍',
};

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
  const icon = toolIcons[toolCall.name] || '🔧';
  
  return (
    <div className={`tool-call-card ${toolCall.status}`}>
      <div className="tool-call-header">
        <span className="tool-icon">{icon}</span>
        <span className="tool-name">{toolCall.name}</span>
        <span className={`tool-status ${toolCall.status}`}>
          {toolCall.status === 'pending' && '执行中...'}
          {toolCall.status === 'success' && '完成'}
          {toolCall.status === 'error' && '失败'}
        </span>
      </div>
      
      <div className="tool-call-body">
        <div className="tool-section">
          <div className="tool-section-label">参数</div>
          <pre className="tool-args">{JSON.stringify(toolCall.args, null, 2)}</pre>
        </div>
        
        {toolCall.result !== undefined && (
          <div className="tool-section">
            <div className="tool-section-label">结果</div>
            <pre className="tool-result">{JSON.stringify(toolCall.result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
