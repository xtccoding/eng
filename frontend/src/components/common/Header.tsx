import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Xtcer Tool
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/typing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              打字练习
            </Link>
            <Link to="/content" className="transition-colors hover:text-foreground/80 text-foreground/60">
              内容库
            </Link>
            <Link to="/progress" className="transition-colors hover:text-foreground/80 text-foreground/60">
              学习进度
            </Link>
            <Link to="/settings" className="transition-colors hover:text-foreground/80 text-foreground/60">
              设置
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* 搜索框可以在这里添加 */}
          </div>
          <nav className="flex items-center">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}