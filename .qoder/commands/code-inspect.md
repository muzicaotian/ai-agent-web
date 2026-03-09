---
description:
---
# React 前端代码审查规范

## 组件规范

### 组件定义
- 使用函数式组件（Function Components）替代类组件
- 组件名称使用 PascalCase 命名规范
- 每个文件只导出一个主组件
- 组件文件使用 `.tsx` 扩展名

// ✅ 推荐
const UserProfile: React.FC<UserProfileProps> = ({ name, age }) => {
  return (
    <div className="user-profile">
      <span>{name}</span>
      <span>{age}</span>
    </div>
  );
};

export default UserProfile;

### Props 规范
- 使用 TypeScript 接口定义 Props 类型
- Props 接口命名格式：`${ComponentName}Props`
- 必填 Props 不设默认值，可选 Props 使用 `?` 标注并提供默认值
- 避免传递不必要的 Props（Props Drilling），使用 Context 或状态管理替代

// ✅ 推荐
interface ButtonProps {
  label: string;           // 必填
  onClick: () => void;     // 必填
  disabled?: boolean;      // 可选
  variant?: 'primary' | 'secondary'; // 可选
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

---

## Hooks 规范

### 使用规则
- 只在函数组件或自定义 Hook 顶层调用 Hook
- 不在循环、条件或嵌套函数中调用 Hook
- 自定义 Hook 以 `use` 开头命名

// ✅ 推荐 - 自定义 Hook
const useFetchUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
};

### useState
- 相关状态合并为对象管理
- 避免冗余状态，可由现有状态派生的值不单独存储

// ✅ 推荐
const [formState, setFormState] = useState({
  username: '',
  email: '',
  password: '',
});

// ❌ 避免
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

### useEffect
- 明确指定依赖数组，避免遗漏依赖
- 清理副作用（订阅、计时器等）
- 避免在 Effect 中直接修改 DOM

// ✅ 推荐
useEffect(() => {
  const subscription = dataService.subscribe(handleData);
  
  return () => {
    subscription.unsubscribe(); // 清理副作用
  };
}, [handleData]);

---

## 状态管理规范

### 本地状态
- 优先使用本地状态（`useState`/`useReducer`）
- 复杂状态逻辑使用 `useReducer`

### 全局状态
- 跨组件共享状态使用 Context API 或状态管理库（如 Zustand、Redux Toolkit）
- 避免过度使用全局状态，优先考虑组件组合

// ✅ 推荐 - Context 使用
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

---

## 性能优化规范

### 避免不必要的渲染
- 使用 `React.memo` 包裹纯展示组件
- 使用 `useCallback` 缓存回调函数
- 使用 `useMemo` 缓存计算结果

// ✅ 推荐
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => expensiveCompute(data), [data]);
  
  const handleClick = useCallback(() => {
    console.log(processedData);
  }, [processedData]);

  return <div onClick={handleClick}>{processedData}</div>;
});

### 懒加载
- 路由级别组件使用 `React.lazy` + `Suspense` 实现懒加载

// ✅ 推荐
const LazyPage = React.lazy(() => import('./pages/LazyPage'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyPage />
  </Suspense>
);

---

## 样式规范

- 使用 CSS Modules 或 Tailwind CSS 管理样式，避免内联样式
- 动态样式使用 `classnames` 或 `clsx` 库处理
- 组件样式文件与组件文件放在同一目录

// ✅ 推荐 - CSS Modules
import styles from './Button.module.css';
import clsx from 'clsx';

const Button = ({ variant, disabled }: ButtonProps) => (
  <button
    className={clsx(styles.btn, {
      [styles.primary]: variant === 'primary',
      [styles.disabled]: disabled,
    })}
  />
);

---

## 文件结构规范

src/
├── components/          # 通用组件
│   └── Button/
│       ├── index.tsx
│       ├── Button.module.css
│       └── Button.test.tsx
├── pages/               # 页面组件
├── hooks/               # 自定义 Hooks
├── contexts/            # Context 定义
├── services/            # API 请求服务
├── store/               # 全局状态管理
├── types/               # TypeScript 类型定义
└── utils/               # 工具函数

---

## 代码质量规范

### 错误处理
- 使用 Error Boundary 捕获组件错误
- 异步操作必须处理错误状态

### 类型安全
- 禁止使用 `any` 类型，使用 `unknown` 替代
- 为所有公共 API 提供完整的类型定义

### 注释规范
- 复杂逻辑添加必要注释
- 公共组件和 Hooks 添加 JSDoc 注释

/**
 * 用户头像组件
 * @param src - 头像图片地址
 * @param alt - 图片描述文本
 * @param size - 头像尺寸，默认为 'medium'
 */
const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'medium' }) => {
  // ...
};

---

## 测试规范

- 使用 `@testing-library/react` 编写组件测试
- 测试文件命名：`ComponentName.test.tsx`
- 优先测试用户行为，而非实现细节

// ✅ 推荐
import { render, screen, fireEvent } from '@testing-library/react';

test('点击按钮触发回调', () => {
  const handleClick = jest.fn();
  render(<Button label="提交" onClick={handleClick} />);
  
  fireEvent.click(screen.getByText('提交'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
