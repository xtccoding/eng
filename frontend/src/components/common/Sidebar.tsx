import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/helpers'
import { useAuth } from '@/hooks/useAuth'
import { 
  Home, 
  BookOpen, 
  Headphones, 
  Mic, 
  PenTool, 
  SpellCheck, 
  GraduationCap,
  BarChart3, 
  Settings
} from 'lucide-react'

const sidebarItems = [
  {
    title: '首页',
    href: '/',
    icon: Home,
  },
  {
    title: '技能学习',
    href: '/skills',
    icon: GraduationCap,
  },
  {
    title: '听力训练',
    href: '/listening',
    icon: Headphones,
  },
  {
    title: '口语练习',
    href: '/speaking',
    icon: Mic,
  },
  {
    title: '阅读理解',
    href: '/reading',
    icon: BookOpen,
  },
  {
    title: '写作练习',
    href: '/writing',
    icon: PenTool,
  },
  {
    title: '词汇学习',
    href: '/vocabulary',
    icon: SpellCheck,
  },
  {
    title: '学习进度',
    href: '/progress',
    icon: BarChart3,
  },
  {
    title: '设置',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const location = useLocation()
  const { profile } = useAuth()

  return (
    <aside className="ios-sidebar hidden w-[220px] flex-col md:flex">
      <div className="flex-1 overflow-auto py-4">
        {/* 用户卡片 */}
        <div className="px-4 mb-4">
          <div className="ios-card p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">
                  {profile?.display_name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <div className="ios-body font-semibold">
                  {profile?.display_name || '用户'}
                </div>
                <div className="ios-caption text-muted-foreground">
                  Lv.{profile?.level || 1}
                </div>
              </div>
            </div>
            
            {/* 经验条 */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="ios-caption text-muted-foreground">经验值</span>
                <span className="ios-caption font-medium">
                  {profile?.experience || 0} / {((profile?.level || 1) * 1000)}
                </span>
              </div>
              <div className="ios-progress">
                <div 
                  className="ios-progress-bar" 
                  style={{ 
                    width: `${((profile?.experience || 0) % 1000) / 10}%` 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 导航菜单 */}
        <nav className="grid items-start px-3 gap-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}