import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">页面未找到</h2>
        <p className="text-muted-foreground">
          您访问的页面不存在或已被移除。
        </p>
        <Link to="/">
          <Button>返回首页</Button>
        </Link>
      </div>
    </div>
  )
}