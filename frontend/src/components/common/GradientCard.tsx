import type { ReactNode } from 'react'

interface GradientCardProps {
  gradient: string
  children: ReactNode
  className?: string
}

export function GradientCard({ gradient, children, className = '' }: GradientCardProps) {
  return (
    <div className={`ios-card bg-gradient-to-r ${gradient} ${className}`}>
      {children}
    </div>
  )
}
