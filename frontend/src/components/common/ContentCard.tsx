import type { ReactNode } from 'react'
import type { DifficultyLevel } from '@/types/content'
import { DifficultyBadge } from './DifficultyBadge'

interface ContentCardProps {
  title: string
  difficulty?: DifficultyLevel | string
  snippet?: string
  snippetLength?: number
  animationIndex?: number
  onClick?: () => void
  className?: string
  children?: ReactNode
}

export function ContentCard({
  title,
  difficulty,
  snippet,
  snippetLength = 80,
  animationIndex = 0,
  onClick,
  className = '',
  children,
}: ContentCardProps) {
  return (
    <div
      className={`ios-card cursor-pointer hover:scale-[1.02] transition-all duration-200 animate-ios-fade-in ${className}`}
      style={{ animationDelay: `${animationIndex * 50}ms` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="ios-body font-semibold flex-1">{title}</h3>
        {difficulty && <DifficultyBadge difficulty={difficulty} />}
      </div>
      {snippet && (
        <p className="ios-caption text-muted-foreground mb-3 line-clamp-2">
          {snippet.substring(0, snippetLength)}...
        </p>
      )}
      {children}
    </div>
  )
}
