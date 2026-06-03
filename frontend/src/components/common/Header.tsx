import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useAuth } from '@/hooks/useAuth'
import { LogOut, User } from 'lucide-react'

export function Header() {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="ios-nav sticky top-0 z-50">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight">EngFlow</span>
          </Link>
          <nav className="flex items-center space-x-1">
            <Link to="/skills" className="ios-nav-item">
              技能学习
            </Link>
            <Link to="/practice" className="ios-nav-item">
              打字练习
            </Link>
            <Link to="/vocabulary" className="ios-nav-item">
              词汇
            </Link>
            <Link to="/progress" className="ios-nav-item">
              进度
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center gap-2">
            <ModeToggle />
            {user && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {profile?.display_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  title="退出登录"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}