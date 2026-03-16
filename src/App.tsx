import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Home, Package, Info, MessageSquare, Radar } from 'lucide-react'
import { ChatContainer } from './components/Chat/ChatContainer'
import { PerformanceRadar } from './components/PerformanceRadar/PerformanceRadar'
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'

// 导航组件
function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname.startsWith('/products') || location.pathname === '/cart' || location.pathname === '/about';
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* 左侧导航 */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link
              to="/chat"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/chat')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/60 hover:text-foreground/80 hover:bg-accent'
                }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline-block">聊天</span>
            </Link>
            <Link
              to="/radar"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/radar')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/60 hover:text-foreground/80 hover:bg-accent'
                }`}
            >
              <Radar className="h-4 w-4" />
              <span className="hidden sm:inline-block">雷达</span>
            </Link>
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/60 hover:text-foreground/80 hover:bg-accent'
                }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline-block">电商</span>
            </Link>
          </nav>
        </div>

        {/* 右侧 - 仅在电商页面显示购物车 */}
        {isActive('/') && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                <Home className="h-4 w-4 inline mr-1" />
                首页
              </Link>
              <Link to="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
                <Package className="h-4 w-4 inline mr-1" />
                商品
              </Link>
              <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                <Info className="h-4 w-4 inline mr-1" />
                关于我们
              </Link>
            </div>
            <Link to="/cart" className="inline-flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
              <span className="ml-2 text-sm hidden sm:inline">购物车</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* 统一导航栏 */}
        <Navigation />

        {/* 主内容区 */}
        <main className="container py-6">
          <Routes>
            {/* 聊天页面 */}
            <Route path="/chat" element={<ChatContainer />} />

            {/* 雷达图页面 */}
            <Route path="/radar" element={<PerformanceRadar />} />

            {/* 电商页面路由 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* 页脚 - 仅在电商页面显示 */}
        <Footer />
      </div>
    </Router>
  );
}

// 页脚组件（仅在电商页面显示）
function Footer() {
  const location = useLocation();
  const isEcommerce = location.pathname === '/' ||
    location.pathname.startsWith('/products') ||
    location.pathname === '/cart' ||
    location.pathname === '/about';

  if (!isEcommerce) return null;

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2024 电商商城。All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default App
