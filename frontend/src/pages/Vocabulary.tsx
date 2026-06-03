import { useState, useEffect } from 'react'
import { useContentStore } from '@/stores/contentStore'
import { TypingArea } from '@/components/typing/TypingArea'
import { Badge } from '@/components/ui/badge'
import { SpellCheck, BookOpen, Star } from 'lucide-react'

export function Vocabulary() {
  const { contents, fetchContents } = useContentStore()
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)

  useEffect(() => {
    fetchContents({ content_type: 'vocabulary' })
  }, [fetchContents])

  const words = selectedContent?.content_text.split('\n').filter(Boolean) || []
  const translations = selectedContent?.translation?.split('\n').filter(Boolean) || []
  const currentWord = words[currentWordIndex] || ''
  const currentTranslation = translations[currentWordIndex] || ''

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6 animate-ios-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <SpellCheck className="h-5 w-5 text-white" />
          </div>
          <h1 className="ios-title">词汇学习</h1>
        </div>
        <p className="ios-body text-muted-foreground">
          系统学习英语词汇，扩大词汇量
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
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="ios-caption text-muted-foreground">
                  {content.content_text.split('\n').filter(Boolean).length} 个单词
                </span>
              </div>
            </div>
          ))}
          
          {contents.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <p className="ios-body text-muted-foreground">暂无词汇材料</p>
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
                onClick={() => {
                  setSelectedContent(null)
                  setCurrentWordIndex(0)
                  setShowTranslation(false)
                }}
              >
                返回列表
              </button>
            </div>

            {/* 单词进度 */}
            <div className="flex items-center justify-between mb-4">
              <span className="ios-caption text-muted-foreground">
                单词 {currentWordIndex + 1} / {words.length}
              </span>
              <div className="flex gap-1">
                {words.map((_: any, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentWordIndex ? 'bg-blue-500' : 
                      index < currentWordIndex ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 当前单词 */}
          <div className="ios-card bg-gradient-to-r from-pink-500/10 to-rose-500/10">
            <div className="text-center py-8">
              <div className="ios-title mb-4">{currentWord.split(' - ')[0]}</div>
              <button
                className="ios-button-secondary mb-4"
                onClick={() => setShowTranslation(!showTranslation)}
              >
                {showTranslation ? '隐藏翻译' : '显示翻译'}
              </button>
              {showTranslation && (
                <div className="ios-body text-muted-foreground animate-ios-fade-in">
                  {currentTranslation}
                </div>
              )}
            </div>
          </div>

          {/* 单词列表 */}
          <div className="ios-card">
            <h3 className="ios-subtitle mb-4">单词列表</h3>
            <div className="space-y-2 max-h-[300px] overflow-auto">
              {words.map((word: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    index === currentWordIndex ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentWordIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="ios-caption text-muted-foreground w-6">{index + 1}</span>
                    <span className="ios-body font-medium">{word.split(' - ')[0]}</span>
                  </div>
                  <span className="ios-caption text-muted-foreground">
                    {translations[index]?.split(' - ')[1] || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex gap-3">
            <button
              className="ios-button-secondary flex-1"
              onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
              disabled={currentWordIndex === 0}
            >
              上一个
            </button>
            <button
              className="ios-button flex-1"
              onClick={() => {
                if (currentWordIndex < words.length - 1) {
                  setCurrentWordIndex(currentWordIndex + 1)
                  setShowTranslation(false)
                }
              }}
              disabled={currentWordIndex === words.length - 1}
            >
              下一个
            </button>
          </div>
        </div>
      )}
    </div>
  )
}