import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
  gradient?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  gradient = 'from-blue-500 to-purple-600',
  className = '',
  children,
}: PageHeaderProps) {
  return (
    <div className={`mb-6 animate-ios-fade-in ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <h1 className="ios-title">{title}</h1>
        {children}
      </div>
      {subtitle && (
        <p className="ios-body text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
