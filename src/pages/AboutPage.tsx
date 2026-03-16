import { Info, Users, Award, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">关于我们</h1>
        <p className="text-muted-foreground mt-1">了解电商商城的故事</p>
      </div>

      {/* 公司介绍 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6" />
            公司简介
          </CardTitle>
          <CardDescription>我们的使命和愿景</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed">
            电商商城成立于 2024 年，是一家专注于为消费者提供优质电子产品的在线购物平台。
            我们致力于为用户带来最优质的购物体验，从商品选择到配送服务，每一个环节都严格把控。
          </p>
          <p className="leading-relaxed">
            我们的团队由一群热爱科技、热爱生活的年轻人组成。我们相信，通过我们的努力，
            可以让每个人都能轻松享受到科技带来的便利和乐趣。
          </p>
        </CardContent>
      </Card>

      {/* 核心价值观 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <Award className="h-10 w-10 text-primary mb-2" />
            <CardTitle>品质保证</CardTitle>
            <CardDescription>只销售正品行货</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>客户至上</CardTitle>
            <CardDescription>7×24 小时贴心服务</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Heart className="h-10 w-10 text-primary mb-2" />
            <CardTitle>诚信经营</CardTitle>
            <CardDescription>透明价格，放心购物</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Info className="h-10 w-10 text-primary mb-2" />
            <CardTitle>创新驱动</CardTitle>
            <CardDescription>持续优化购物体验</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 联系我们 */}
      <Card>
        <CardHeader>
          <CardTitle>联系我们</CardTitle>
          <CardDescription>如有任何问题，请随时与我们联系</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>客服电话：</strong>400-888-8888</p>
          <p><strong>客服邮箱：</strong>support@ecommerce.com</p>
          <p><strong>工作时间：</strong>周一至周日 9:00-21:00</p>
          <p><strong>公司地址：</strong>北京市朝阳区科技园 A 座 10 层</p>
        </CardContent>
      </Card>

      {/* 数据统计 */}
      <Card>
        <CardHeader>
          <CardTitle>我们的成绩</CardTitle>
          <CardDescription>用数据说话</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10,000+</p>
              <p className="text-muted-foreground mt-1">注册用户</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">5,000+</p>
              <p className="text-muted-foreground mt-1">在售商品</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">99.9%</p>
              <p className="text-muted-foreground mt-1">好评率</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">24h</p>
              <p className="text-muted-foreground mt-1">快速发货</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
