import { useState } from 'react'
import { useSkillPractice } from '@/hooks/useSkillPractice'
import { PageHeader, EmptyState, ContentCard, DetailHeader, GradientCard } from '@/components/common'
import { TypingArea } from '@/components/typing/TypingArea'
import { Headphones, Play, Pause } from 'lucide-react'

export function Listening() {
  const { contents, selectedContent, handleSelectContent, handleBack } = useSkillPractice({
    contentType: 'listening',
  })
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <PageHeader
        icon={Headphones}
        title="听力训练"
        subtitle="通过听写练习提升听力理解能力"
        gradient="from-blue-500 to-cyan-500"
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
                <button className="ios-button-secondary p-2 rounded-full">
                  <Play className="h-4 w-4" />
                </button>
                <span className="ios-caption text-muted-foreground">点击开始听写</span>
              </div>
            </ContentCard>
          ))}
          {contents.length === 0 && <EmptyState icon="🎧" message="暂无听力材料" />}
        </div>
      ) : (
        <div className="space-y-6 animate-ios-fade-in">
          <DetailHeader
            title={selectedContent.title}
            onBack={handleBack}
          >
            <GradientCard gradient="from-blue-500/10 to-cyan-500/10" className="mb-4">
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
            </GradientCard>
            <div className="ios-caption text-muted-foreground">
              听音频，然后在下方输入你听到的内容
            </div>
          </DetailHeader>

          <div className="ios-card">
            <TypingArea
              content={selectedContent.content_text}
              isActive={true}
              onComplete={() => console.log('练习完成')}
              onReset={handleBack}
            />
          </div>
        </div>
      )}
    </div>
  )
}
