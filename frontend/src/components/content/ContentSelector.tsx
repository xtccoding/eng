import { Badge } from '@/components/ui/badge'

interface ContentSelectorProps {
  contents: any[]
  onSelect: (content: any) => void
}

export function ContentSelector({ contents, onSelect }: ContentSelectorProps) {
  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📝</div>
        <div className="ios-body text-muted-foreground">暂无内容，请先添加内容</div>
      </div>
    )
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }
  
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return difficulty
    }
  }
  
  return (
    <div className="space-y-3">
      {contents.map((content, index) => (
        <div
          key={content.id}
          className="ios-card cursor-pointer hover:scale-[1.01] transition-all duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onSelect(content)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="ios-body font-semibold truncate">{content.title}</h3>
                <span className={`ios-badge ${getDifficultyColor(content.difficulty)}`}>
                  {getDifficultyLabel(content.difficulty)}
                </span>
              </div>
              <p className="ios-caption text-muted-foreground mb-2">
                {content.category} • {content.content_type}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {content.content_text.substring(0, 120)}...
              </p>
              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {content.tags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="ios-badge-ios-badge-blue text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button className="ios-button-secondary whitespace-nowrap text-sm px-4 py-2">
              开始
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}