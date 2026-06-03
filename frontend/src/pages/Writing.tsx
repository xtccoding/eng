import { useState, useEffect } from 'react'
import { useContentStore } from '@/stores/contentStore'
import { TypingArea } from '@/components/typing/TypingArea'
import { Badge } from '@/components/ui/badge'
import { PenTool, FileText, Lightbulb } from 'lucide-react'

export function Writing() {
  const { contents, fetchContents } = useContentStore()
  const [selectedContent, setSelectedContent] = useState<any>(null)

  useEffect(() => {
    fetchContents({ content_type: 'writing' })
  }, [fetchContents])

  const handleComplete = () => {
    console.log('写作完成')
  }

  const handleReset = () => {
    setSelectedContent(null)
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6 animate-ios-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <PenTool className="h-5 w-5 text-white" />
          </div>
          <h1 className="ios-title">写作练习</h1>
        </div>
        <p className="ios-body text-muted-foreground">
          通过打字练习提升英文写作能力
        </p>
      </div>

      {!selectedContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((content, index) => (
            <div
              key={content.id}
              className="ios-card cursor-pointer hover:scale-[1.02] transition-all duration-200 animate-ios-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedContent(content)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="ios-body font-semibold">{content.title}</h3>
                <Badge variant="outline">
                  {content.difficulty === 'easy' ? '简单' : content.difficulty === 'medium' ? '中等' : '困难'}
                </Badge>
              </div>
              <p className="ios-caption text-muted-foreground line-clamp-2">
                {content.content_text.substring(0, 80)}...
              </p>
              <div className="flex items-center gap-2 mt-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="ios-caption text-muted-foreground">
                  {content.content_text.length} 字符
                </span>
              </div>
            </div>
          ))}
          
          {contents.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-5xl mb-4">✍️</div>
              <p className="ios-body text-muted-foreground">暂无写作材料</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-ios-fade-in">
          <div className="ios-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="ios-subtitle">{selectedContent.title}</h2>
              <button 
                className="ios-button-secondary"
                onClick={() => setSelectedContent(null)}
              >
                返回列表
              </button>
            </div>

            {/* 写作提示 */}
            <div className="ios-card bg-gradient-to-r from-orange-500/10 to-red-500/10 mb-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="ios-body font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    写作提示
                  </div>
                  <p className="ios-caption text-orange-600 dark:text-orange-300">
                    仔细阅读范文，然后在下方跟着打字练习。注意语法、拼写和标点符号。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 打字练习 */}
          <div className="ios-card">
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