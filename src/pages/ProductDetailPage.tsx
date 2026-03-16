import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// 示例商品数据（实际应从 API 获取）
const products = [
  {
    id: 1,
    name: '智能手机 X1',
    price: 3999,
    description: '高性能旗舰手机，配备最新处理器和先进的摄像头系统。6.7 英寸 Super Retina XDR 显示屏，A15 仿生芯片，支持 5G 网络。',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
    rating: 4.8,
    reviews: 256,
    stock: 50,
    specs: {
      '屏幕': '6.7 英寸',
      '处理器': 'A15 仿生',
      '内存': '8GB',
      '存储': '256GB',
      '电池': '4500mAh',
    },
  },
  {
    id: 2,
    name: '无线耳机 Pro',
    price: 1299,
    description: '主动降噪技术，提供卓越的音质体验。支持空间音频，单次充电可使用 6 小时，配合充电盒可达 30 小时。',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    rating: 4.6,
    reviews: 189,
    stock: 100,
    specs: {
      '类型': '入耳式',
      '降噪': '主动降噪',
      '续航': '30 小时',
      '防水': 'IPX4',
      '连接': '蓝牙 5.0',
    },
  },
]

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">商品未找到</h1>
        <Button asChild className="mt-4">
          <Link to="/products">返回商品列表</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <Button variant="ghost" asChild>
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回商品列表
        </Link>
      </Button>

      {/* 商品详情 */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* 商品图片 */}
        <Card>
          <CardContent className="p-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </CardContent>
        </Card>

        {/* 商品信息 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-yellow-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1 text-lg font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} 条评价)</span>
            </div>
          </div>

          <p className="text-4xl font-bold text-primary">¥{product.price}</p>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* 库存状态 */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? '有货' : '缺货'}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <Button size="lg" className="flex-1" asChild>
              <Link to="/cart">
                <ShoppingCart className="mr-2 h-5 w-5" />
                加入购物车
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              立即购买
            </Button>
          </div>
        </div>
      </div>

      {/* 规格参数 */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">规格参数</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 商品评价 */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">用户评价</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium">用户{i * 10}</span>
                </div>
                <p className="text-muted-foreground">
                  这是一个示例评价。商品质量很好，物流也很快，非常满意！
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
