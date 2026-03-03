import type { ToolCallInfo } from '../../types';
import './ToolCallCard.css';

interface ToolCallCardProps {
  toolCall: ToolCallInfo;
}

const toolIcons: Record<string, string> = {
  get_weather: '🌤️',
  calculate: '🔢',
  web_search: '🔍',
  // Playwright 工具
  'playwright.browser_navigate': '🌐',
  'playwright.browser_click': '🖱️',
  'playwright.browser_type': '⌨️',
  'playwright.browser_take_screenshot': '📸',
  'playwright.browser_snapshot': '📄',
  'playwright.browser_install': '🔧',
  'playwright.browser_close': '❌',
  'playwright.browser_evaluate': '⚡',
  'playwright.browser_wait_for': '⏱️',
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
