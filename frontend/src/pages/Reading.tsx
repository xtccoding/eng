import { useState, useEffect } from 'react'
import { useContentStore } from '@/stores/contentStore'
import { TypingArea } from '@/components/typing/TypingArea'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Target } from 'lucide-react'

export function Reading() {
  const { contents, fetchContents } = useContentStore()
  const [selectedContent, setSelectedContent] = useState<any>(null)

  useEffect(() => {
    fetchContents({ content_type: 'reading' })
  }, [fetchContents])

  const handleComplete = () => {
    console.log('阅读完成')
  }

  const handleReset = () => {
    setSelectedContent(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-orange-100 text-orange-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6 animate-ios-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="ios-title">阅读理解</h1>
        </div>
        <p className="ios-body text-muted-foreground">
          阅读英文文章，提升阅读速度和理解力
        </p>
      </div>

      {!selectedContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contents.map((content, index) => (
            <div
              key={content.id}
              className="ios-card cursor-pointer hover:scale-[1.02] transition-all duration-200 animate-ios-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedContent(content)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="ios-body font-semibold flex-1">{content.title}</h3>
                <span className={`ios-badge ${getDifficultyColor(content.difficulty)}`}>
                  {content.difficulty === 'easy' ? '简单' : content.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
              <p className="ios-caption text-muted-foreground mb-4 line-clamp-3">
                {content.content_text.substring(0, 150)}...
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="ios-caption text-muted-foreground">
                    约 {Math.ceil(content.content_text.length / 200)} 分钟
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="ios-caption text-muted-foreground">
                    {content.content_text.length} 字符
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {contents.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-5xl mb-4">📖</div>
              <p className="ios-body text-muted-foreground">暂无阅读材料</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-ios-fade-in">
          {/* 文章头部 */}
          <div className="ios-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="ios-subtitle mb-1">{selectedContent.title}</h2>
                <div className="flex items-center gap-3">
                  <span className={`ios-badge ${getDifficultyColor(selectedContent.difficulty)}`}>
                    {selectedContent.difficulty === 'easy' ? '简单' : selectedContent.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                  <span className="ios-caption text-muted-foreground">
                    {selectedContent.category}
                  </span>
                </div>
              </div>
              <button 
                className="ios-button-secondary"
                onClick={() => setSelectedContent(null)}
              >
                返回列表
              </button>
            </div>

            {/* 文章预览 */}
            <div className="ios-card bg-muted/50 mb-4">
              <p className="ios-body leading-relaxed whitespace-pre-wrap">
                {selectedContent.content_text}
              </p>
            </div>

            {/* 翻译 */}
            {selectedContent.translation && (
              <div className="ios-card bg-blue-50 dark:bg-blue-900/20">
                <div className="ios-caption text-blue-600 dark:text-blue-400 mb-2 font-medium">
                  中文翻译
                </div>
                <p className="ios-body text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                  {selectedContent.translation}
                </p>
              </div>
            )}
          </div>

          {/* 打字练习 */}
          <div className="ios-card">
            <h3 className="ios-subtitle mb-4">跟读练习</h3>
            <TypingArea
              content={selectedContent.content_text}
              isActive={true}
              onComplete={handleComplete}
              onReset={handleReset}
            />
          </div>
        </div>
      )}
    </div>
  )
}