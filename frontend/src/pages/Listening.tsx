import { useState, useEffect } from 'react'
import { useContentStore } from '@/stores/contentStore'
import { TypingArea } from '@/components/typing/TypingArea'
import { Badge } from '@/components/ui/badge'
import { Headphones, Play, Pause } from 'lucide-react'

export function Listening() {
  const { contents, fetchContents } = useContentStore()
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetchContents({ content_type: 'listening' })
  }, [fetchContents])

  const handleComplete = () => {
    console.log('练习完成')
  }

  const handleReset = () => {
    setSelectedContent(null)
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6 animate-ios-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <h1 className="ios-title">听力训练</h1>
        </div>
        <p className="ios-body text-muted-foreground">
          通过听写练习提升听力理解能力
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
              <p className="ios-caption text-muted-foreground mb-3 line-clamp-2">
                {content.content_text.substring(0, 80)}...
              </p>
              <div className="flex items-center gap-2">
                <button className="ios-button-secondary p-2 rounded-full">
                  <Play className="h-4 w-4" />
                </button>
                <span className="ios-caption text-muted-foreground">点击开始听写</span>
              </div>
            </div>
          ))}
          
          {contents.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-5xl mb-4">🎧</div>
              <p className="ios-body text-muted-foreground">暂无听力材料</p>
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
            
            {/* 音频播放器 */}
            <div className="ios-card bg-gradient-to-r from-blue-500/10 to-cyan-500/10 mb-4">
              <div className="flex items-center gap-4">
                <button 
                  className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <span className="ios-caption">1:23 / 4:56</span>
              </div>
            </div>

            {/* 提示 */}
            <div className="ios-caption text-muted-foreground mb-4">
              听音频，然后在下方输入你听到的内容
            </div>
          </div>

          {/* 打字区域 */}
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