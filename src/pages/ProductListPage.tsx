import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// 示例商品数据
const products = [
  {
    id: 1,
    name: '智能手机 X1',
    price: 3999,
    description: '高性能旗舰手机，配备最新处理器',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.8,
    category: '手机',
  },
  {
    id: 2,
    name: '无线耳机 Pro',
    price: 1299,
    description: '主动降噪，超长续航',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    rating: 4.6,
    category: '音频',
  },
  {
    id: 3,
    name: '智能手表 S3',
    price: 2499,
    description: '健康监测，运动追踪',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    rating: 4.7,
    category: '穿戴',
  },
  {
    id: 4,
    name: '笔记本电脑 Air',
    price: 7999,
    description: '轻薄便携，性能强劲',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    rating: 4.9,
    category: '电脑',
  },
  {
    id: 5,
    name: '机械键盘 K1',
    price: 599,
    description: 'Cherry 轴体，RGB 背光',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    rating: 4.5,
    category: '配件',
  },
  {
    id: 6,
    name: '无线鼠标 M2',
    price: 299,
    description: '人体工学设计，长续航',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    rating: 4.4,
    category: '配件',
  },
]

const categories = ['全部', '手机', '音频', '穿戴', '电脑', '配件']

export default function ProductListPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">商品列表</h1>
          <p className="text-muted-foreground mt-1">探索我们的精选商品</p>
        </div>

        {/* 搜索框 */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="flex items-center gap-2"
          >
            {category === '全部' && <Filter className="h-4 w-4" />}
            {category}
          </Button>
        ))}
      </div>

      {/* 商品网格 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">未找到符合条件的商品</p>
        </div>
      )}
    </div>
  )
}
