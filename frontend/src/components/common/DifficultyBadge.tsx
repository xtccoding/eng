import { Badge } from '@/components/ui/badge'
import { getDifficultyLabel, getDifficultyColor } from '@/utils/helpers'
import type { DifficultyLevel } from '@/types/content'

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel | string
  variant?: 'default' | 'outline'
  className?: string
}

export function DifficultyBadge({ difficulty, variant = 'outline', className = '' }: DifficultyBadgeProps) {
  if (variant === 'default') {
    return (
      <span className={`ios-badge ${getDifficultyColor(difficulty)} ${className}`}>
        {getDifficultyLabel(difficulty)}
      </span>
    )
  }

  return (
    <Badge variant="outline" className={className}>
      {getDifficultyLabel(difficulty)}
    </Badge>
  )
}
