import { useState } from 'react'
import { useSkillPractice } from '@/hooks/useSkillPractice'
import { PageHeader, EmptyState, ContentCard, DetailHeader, GradientCard } from '@/components/common'
import { SpellCheck, BookOpen } from 'lucide-react'

export function Vocabulary() {
  const { contents, selectedContent, handleSelectContent, handleBack: handleBackBase } = useSkillPractice({
    contentType: 'vocabulary',
  })
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)

  const words = selectedContent?.content_text.split('\n').filter(Boolean) || []
  const translations = selectedContent?.translation?.split('\n').filter(Boolean) || []
  const currentWord = words[currentWordIndex] || ''
  const currentTranslation = translations[currentWordIndex] || ''

  const handleBack = () => {
    setCurrentWordIndex(0)
    setShowTranslation(false)
    handleBackBase()
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <PageHeader
        icon={SpellCheck}
        title="词汇学习"
        subtitle="系统学习英语词汇，扩大词汇量"
        gradient="from-pink-500 to-rose-500"
      />

      {!selectedContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((content, index) => (
            <ContentCard
              key={content.id}
              title={content.title}
              difficulty={content.difficulty}
              snippet={content.content_text}
              animationIndex={index}
              onClick={() => handleSelectContent(content)}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="ios-caption text-muted-foreground">
                  {content.content_text.split('\n').filter(Boolean).length} 个单词
                </span>
              </div>
            </ContentCard>
          ))}
          {contents.length === 0 && <EmptyState icon="📝" message="暂无词汇材料" />}
        </div>
      ) : (
        <div className="space-y-6 animate-ios-fade-in">
          <DetailHeader title={selectedContent.title} onBack={handleBack}>
            <div className="flex items-center justify-between mb-4">
              <span className="ios-caption text-muted-foreground">
                单词 {currentWordIndex + 1} / {words.length}
              </span>
              <div className="flex gap-1">
                {words.map((_: string, index: number) => (
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
          </DetailHeader>

          <GradientCard gradient="from-pink-500/10 to-rose-500/10">
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
          </GradientCard>

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

          <div className="flex gap-3">
            <button
              className="ios-button-secondary flex-1"
              onClick={() => {
                setCurrentWordIndex(Math.max(0, currentWordIndex - 1))
                setShowTranslation(false)
              }}
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
