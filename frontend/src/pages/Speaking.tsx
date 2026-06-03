import { useState, useEffect } from 'react'
import { useContentStore } from '@/stores/contentStore'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, RotateCcw } from 'lucide-react'

export function Speaking() {
  const { contents, fetchContents } = useContentStore()
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)

  useEffect(() => {
    fetchContents({ content_type: 'speaking' })
  }, [fetchContents])

  const sentences = selectedContent?.content_text.split('. ').filter(Boolean) || []

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6 animate-ios-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <h1 className="ios-title">口语练习</h1>
        </div>
        <p className="ios-body text-muted-foreground">
          跟读模仿，提升口语表达能力
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
            </div>
          ))}
          
          {contents.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-5xl mb-4">🎤</div>
              <p className="ios-body text-muted-foreground">暂无口语材料</p>
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
          </div>

          {/* 句子列表 */}
          <div className="space-y-3">
            {sentences.map((sentence: string, index: number) => (
              <div 
                key={index}
                className={`ios-card transition-all duration-200 ${
                  index === currentSentence ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="ios-caption text-muted-foreground mb-1">
                      句子 {index + 1}
                    </div>
                    <p className="ios-body">{sentence.trim()}.</p>
                  </div>
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index === currentSentence && isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => {
                      if (index === currentSentence) {
                        setIsRecording(!isRecording)
                      } else {
                        setCurrentSentence(index)
                        setIsRecording(false)
                      }
                    }}
                  >
                    {index === currentSentence && isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 控制按钮 */}
          <div className="ios-card bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="ios-body font-semibold">
                  句子 {currentSentence + 1} / {sentences.length}
                </div>
                <div className="ios-caption text-muted-foreground">
                  {isRecording ? '正在录音...' : '点击麦克风开始跟读'}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="ios-button-secondary"
                  onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                >
                  上一句
                </button>
                <button 
                  className="ios-button"
                  onClick={() => setCurrentSentence(Math.min(sentences.length - 1, currentSentence + 1))}
                >
                  下一句
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}