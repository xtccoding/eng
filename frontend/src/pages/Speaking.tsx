import { useState } from 'react'
import { useSkillPractice } from '@/hooks/useSkillPractice'
import { PageHeader, EmptyState, ContentCard, DetailHeader, GradientCard } from '@/components/common'
import { Mic, MicOff } from 'lucide-react'

export function Speaking() {
  const { contents, selectedContent, handleSelectContent, handleBack } = useSkillPractice({
    contentType: 'speaking',
  })
  const [isRecording, setIsRecording] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)

  const sentences = selectedContent?.content_text.split('. ').filter(Boolean) || []

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <PageHeader
        icon={Mic}
        title="口语练习"
        subtitle="跟读模仿，提升口语表达能力"
        gradient="from-purple-500 to-pink-500"
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
            />
          ))}
          {contents.length === 0 && <EmptyState icon="🎤" message="暂无口语材料" />}
        </div>
      ) : (
        <div className="space-y-6 animate-ios-fade-in">
          <DetailHeader title={selectedContent.title} onBack={handleBack} />

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

          <GradientCard gradient="from-purple-500/10 to-pink-500/10">
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
          </GradientCard>
        </div>
      )}
    </div>
  )
}
