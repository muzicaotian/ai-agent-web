import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// 示例商品数据
const featuredProducts = [
  {
    id: 1,
    name: '智能手机 X1',
    price: 3999,
    description: '高性能旗舰手机，配备最新处理器',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.8,
  },
  {
    id: 2,
    name: '无线耳机 Pro',
    price: 1299,
    description: '主动降噪，超长续航',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    rating: 4.6,
  },
  {
    id: 3,
    name: '智能手表 S3',
    price: 2499,
    description: '健康监测，运动追踪',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    rating: 4.7,
  },
  {
    id: 4,
    name: '笔记本电脑 Air',
    price: 7999,
    description: '轻薄便携，性能强劲',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    rating: 4.9,
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-blue-500/20 p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            欢迎来到电商商城
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            发现最新科技产品，享受优质购物体验。我们为您提供最优质的电子产品和配件。
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" asChild>
              <Link to="/products">
                浏览商品
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              了解更多
            </Button>
          </div>
        </div>
      </section>

      {/* 特色商品 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">热门商品</h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center">
            查看全部
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <CardDescription>{product.description}</CardDescription>
                <p className="text-2xl font-bold text-primary">¥{product.price}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" asChild>
                  <Link to={`/products/${product.id}`}>
                    查看详情
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 特性展示 */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-primary" />
            <CardTitle>品质保证</CardTitle>
            <CardDescription>所有商品均为正品，严格质量检测</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Star className="h-10 w-10 text-primary" />
            <CardTitle>优质服务</CardTitle>
            <CardDescription>7 天无理由退换货，售后无忧</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <ArrowRight className="h-10 w-10 text-primary" />
            <CardTitle>快速配送</CardTitle>
            <CardDescription>全国包邮，最快次日达</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
