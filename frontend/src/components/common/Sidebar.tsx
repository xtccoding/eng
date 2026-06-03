import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Keyboard, 
  BookOpen, 
  BarChart3, 
  Settings,
  Trophy,
  FileText,
  Volume2,
  Medal
} from 'lucide-react'

const sidebarItems = [
  {
    title: '首页',
    href: '/',
    icon: Home,
  },
  {
    title: '打字练习',
    href: '/typing',
    icon: Keyboard,
  },
  {
    title: '内容库',
    href: '/content',
    icon: BookOpen,
  },
  {
    title: '学习进度',
    href: '/progress',
    icon: BarChart3,
  },
  {
    title: '排行榜',
    href: '/leaderboard',
    icon: Medal,
  },
  {
    title: '成就系统',
    href: '/achievements',
    icon: Trophy,
  },
  {
    title: '文章生成',
    href: '/generation',
    icon: FileText,
  },
  {
    title: '发音练习',
    href: '/pronunciation',
    icon: Volume2,
  },
  {
    title: '设置',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden w-[200px] flex-col border-r bg-background md:flex">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                to={item.href}
              >
                <Button
                  variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}