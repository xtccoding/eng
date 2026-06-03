import { useSkillPractice } from '@/hooks/useSkillPractice'
import { PageHeader, EmptyState, ContentCard, DetailHeader, GradientCard } from '@/components/common'
import { TypingArea } from '@/components/typing/TypingArea'
import { PenTool, FileText, Lightbulb } from 'lucide-react'

export function Writing() {
  const { contents, selectedContent, handleSelectContent, handleBack } = useSkillPractice({
    contentType: 'writing',
  })

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <PageHeader
        icon={PenTool}
        title="写作练习"
        subtitle="通过打字练习提升英文写作能力"
        gradient="from-orange-500 to-red-500"
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
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="ios-caption text-muted-foreground">
                  {content.content_text.length} 字符
                </span>
              </div>
            </ContentCard>
          ))}
          {contents.length === 0 && <EmptyState icon="✍️" message="暂无写作材料" />}
        </div>
      ) : (
        <div className="space-y-6 animate-ios-fade-in">
          <DetailHeader title={selectedContent.title} onBack={handleBack}>
            <GradientCard gradient="from-orange-500/10 to-red-500/10" className="mb-4">
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
            </GradientCard>
          </DetailHeader>

          <div className="ios-card">
            <TypingArea
              content={selectedContent.content_text}
              isActive={true}
              onComplete={() => console.log('写作完成')}
              onReset={handleBack}
            />
          </div>
        </div>
      )}
    </div>
  )
}
