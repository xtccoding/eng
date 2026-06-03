import { Link } from 'react-router-dom'
import { 
  Headphones, 
  Mic, 
  BookOpen, 
  PenTool, 
  SpellCheck, 
  GraduationCap,
  Trophy,
  Zap,
  Clock,
  Target
} from 'lucide-react'

const skillCards = [
  {
    title: '听力训练',
    description: '通过听写练习提升听力理解能力',
    icon: Headphones,
    href: '/listening',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: '口语练习',
    description: '跟读模仿，提升口语表达能力',
    icon: Mic,
    href: '/speaking',
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    title: '阅读理解',
    description: '阅读英文文章，提升阅读速度和理解力',
    icon: BookOpen,
    href: '/reading',
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    title: '写作练习',
    description: '通过打字练习提升英文写作能力',
    icon: PenTool,
    href: '/writing',
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    title: '词汇学习',
    description: '系统学习英语词汇，扩大词汇量',
    icon: SpellCheck,
    href: '/vocabulary',
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    title: '综合练习',
    description: '全面提升英语技能的综合练习',
    icon: GraduationCap,
    href: '/skills',
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
]

const quickStats = [
  { label: '今日学习', value: '0分钟', icon: Clock, color: 'text-blue-500' },
  { label: '连续天数', value: '0天', icon: Zap, color: 'text-orange-500' },
  { label: '掌握词汇', value: '0个', icon: Target, color: 'text-green-500' },
  { label: '完成练习', value: '0次', icon: Trophy, color: 'text-purple-500' },
]

export function Home() {
  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      {/* 欢迎区域 */}
      <div className="mb-8 animate-ios-fade-in">
        <h1 className="ios-title mb-2">学习英语</h1>
        <p className="ios-body text-muted-foreground">
          通过打字练习，全面提升英语技能
        </p>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="ios-card animate-ios-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-muted ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="ios-body font-semibold">{stat.value}</div>
                  <div className="ios-caption">{stat.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 技能卡片 */}
      <div className="mb-6">
        <h2 className="ios-subtitle mb-4">选择学习内容</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link
                key={index}
                to={card.href}
                className="ios-card group hover:scale-[1.02] transition-all duration-200 animate-ios-fade-in"
                style={{ animationDelay: `${(index + 4) * 50}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="ios-body font-semibold mb-1">{card.title}</h3>
                <p className="ios-caption text-muted-foreground">{card.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 快速开始 */}
      <div className="ios-card bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-ios-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="ios-subtitle mb-1">快速开始</h3>
            <p className="ios-caption text-muted-foreground">选择一个技能开始学习</p>
          </div>
          <Link to="/skills">
            <button className="ios-button">
              开始学习
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}