import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon | string
  title?: string
  message: string
  className?: string
}

export function EmptyState({ icon, title, message, className = '' }: EmptyStateProps) {
  return (
    <div className={`col-span-full text-center py-16 ${className}`}>
      {icon && typeof icon === 'string' ? (
        <div className="text-5xl mb-4">{icon}</div>
      ) : icon ? (
        <div className="flex justify-center mb-4">
          {(() => {
            const Icon = icon as LucideIcon
            return <Icon className="h-12 w-12 text-muted-foreground" />
          })()}
        </div>
      ) : null}
      {title && (
        <h3 className="ios-body font-semibold mb-2">{title}</h3>
      )}
      <p className="ios-body text-muted-foreground">{message}</p>
    </div>
  )
}
