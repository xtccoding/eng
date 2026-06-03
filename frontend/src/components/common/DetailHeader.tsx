import type { ReactNode } from 'react'

interface DetailHeaderProps {
  title: string
  subtitle?: string
  onBack: () => void
  backLabel?: string
  children?: ReactNode
  className?: string
}

export function DetailHeader({
  title,
  subtitle,
  onBack,
  backLabel = '返回列表',
  children,
  className = '',
}: DetailHeaderProps) {
  return (
    <div className={`ios-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="ios-subtitle">{title}</h2>
          {subtitle && (
            <p className="ios-caption text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <button className="ios-button-secondary" onClick={onBack}>
          {backLabel}
        </button>
      </div>
      {children}
    </div>
  )
}
