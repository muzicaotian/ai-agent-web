import './PerformanceRadar.css';

type Metric = {
  id: 'speed' | 'accuracy' | 'reliability' | 'efficiency' | 'flexibility';
  label: string;
  value: number;
  icon: JSX.Element;
};

const metrics: Metric[] = [
  {
    id: 'speed',
    label: 'Speed',
    value: 85,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2L6 13h4l-1 9 7-11h-4l1-9z" />
      </svg>
    ),
  },
  {
    id: 'accuracy',
    label: 'Accuracy',
    value: 90,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4 8.5A4.5 4.5 0 0112 12a4.5 4.5 0 014 3.5H8z" />
      </svg>
    ),
  },
  {
    id: 'reliability',
    label: 'Reliability',
    value: 95,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l7 3v6c0 5-3.4 9.7-7 11-3.6-1.3-7-6-7-11V5l7-3zm-1 12l5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3z" />
      </svg>
    ),
  },
  {
    id: 'efficiency',
    label: 'Efficiency',
    value: 70,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19h4V9H4v10zm6 0h4V5h-4v14zm6 0h4v-7h-4v7z" />
      </svg>
    ),
  },
  {
    id: 'flexibility',
    label: 'Flexibility',
    value: 75,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 6a2 2 0 114 0v4h2V6a2 2 0 114 0v4h1a2 2 0 012 2v5h-2v-5h-2v5h-2v-5h-2v5h-2v-5H9v5H7v-5H5v5H3v-5a2 2 0 012-2h2V6z" />
      </svg>
    ),
  },
];

const navItems = [
  { label: 'Dashboard', active: false },
  { label: 'Analytics', active: true },
  { label: 'Reports', active: false },
  { label: 'Settings', active: false },
] as const;

const chartSize = 224;
const radius = chartSize / 2;
const ringSteps = 5;

function polarToCartesian(angleInDegrees: number, valuePercent: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  const scale = valuePercent / 100;
  const distance = radius * scale;
  const x = radius + distance * Math.cos(angleInRadians);
  const y = radius + distance * Math.sin(angleInRadians);
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function PerformanceRadar() {
  const values = metrics.map((item) => item.value);
  const overall = average(values);
  const polygonPoints = metrics
    .map((metric, index) => {
      const angle = (360 / metrics.length) * index;
      return polarToCartesian(angle, metric.value);
    })
    .join(' ');

  const axisPoints = metrics.map((_, index) => {
    const angle = (360 / metrics.length) * index;
    return polarToCartesian(angle, 100);
  });

  return (
    <div className="performance-page">
      <div className="performance-card">
        <header className="performance-header">
          <button className="icon-button" aria-label="Back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <h1>Performance Radar</h1>
          <button className="icon-button" aria-label="More">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
            </svg>
          </button>
        </header>

        <main className="performance-main">
          <section className="radar-section">
            <div className="radar-wrapper" aria-label="Performance radar chart">
              <svg className="radar-svg" viewBox={`0 0 ${chartSize} ${chartSize}`} role="img">
                {Array.from({ length: ringSteps }).map((_, index) => {
                  const ringRadius = radius - (radius / ringSteps) * index;
                  return (
                    <circle
                      key={`ring-${ringRadius}`}
                      cx={radius}
                      cy={radius}
                      r={ringRadius}
                      className="radar-ring"
                    />
                  );
                })}
                {axisPoints.map((point) => {
                  const [x2, y2] = point.split(',');
                  return <line key={`axis-${point}`} x1={radius} y1={radius} x2={x2} y2={y2} className="radar-axis" />;
                })}
                <polygon points={polygonPoints} className="radar-polygon-fill" />
                <polyline points={`${polygonPoints} ${polygonPoints.split(' ')[0]}`} className="radar-polygon-stroke" />
                {metrics.map((metric, index) => {
                  const [cx, cy] = polarToCartesian((360 / metrics.length) * index, metric.value).split(',');
                  return <circle key={metric.id} cx={cx} cy={cy} r="3" className="radar-point" />;
                })}
              </svg>

              <span className="radar-label radar-label-top">Speed</span>
              <span className="radar-label radar-label-right-top">Accuracy</span>
              <span className="radar-label radar-label-right-bottom">Reliability</span>
              <span className="radar-label radar-label-left-bottom">Efficiency</span>
              <span className="radar-label radar-label-left-top">Flexibility</span>
            </div>

            <div className="overall-score">
              <div className="overall-value">{overall.toFixed(1)}%</div>
              <div className="overall-label">Overall Performance</div>
            </div>
          </section>

          <section className="metric-list">
            {metrics.map((metric) => (
              <article key={metric.id} className="metric-item">
                <div className="metric-icon" aria-hidden="true">
                  {metric.icon}
                </div>
                <div className="metric-content">
                  <div className="metric-head">
                    <span>{metric.label}</span>
                    <span>{metric.value}%</span>
                  </div>
                  <div className="metric-track">
                    <div className="metric-fill" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>

        <nav className="bottom-nav" aria-label="Primary">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item${item.active ? ' is-active' : ''}`} type="button">
              <span className="nav-dot" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
