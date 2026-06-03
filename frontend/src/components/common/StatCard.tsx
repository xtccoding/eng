import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: string
  description?: string
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = 'text-blue-500',
  description,
  className = '',
}: StatCardProps) {
  return (
    <div className={`ios-card animate-ios-fade-in ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="ios-body font-semibold">{value}</div>
          <div className="ios-caption">{label}</div>
          {description && (
            <div className="ios-caption text-muted-foreground mt-0.5">{description}</div>
          )}
        </div>
      </div>
    </div>
  )
}
