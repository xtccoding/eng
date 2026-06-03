import { useSkillPractice } from '@/hooks/useSkillPractice'
import { PageHeader, EmptyState, ContentCard, DetailHeader, DifficultyBadge } from '@/components/common'
import { TypingArea } from '@/components/typing/TypingArea'
import { BookOpen, Clock, Target } from 'lucide-react'

export function Reading() {
  const { contents, selectedContent, handleSelectContent, handleBack } = useSkillPractice({
    contentType: 'reading',
  })

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <PageHeader
        icon={BookOpen}
        title="阅读理解"
        subtitle="阅读英文文章，提升阅读速度和理解力"
        gradient="from-green-500 to-emerald-500"
      />

      {!selectedContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contents.map((content, index) => (
            <ContentCard
              key={content.id}
              title={content.title}
              difficulty={content.difficulty}
              snippet={content.content_text}
              snippetLength={150}
              animationIndex={index}
              onClick={() => handleSelectContent(content)}
            >
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
            </ContentCard>
          ))}
          {contents.length === 0 && <EmptyState icon="📖" message="暂无阅读材料" />}
        </div>
      ) : (
        <div className="space-y-6 animate-ios-fade-in">
          <DetailHeader
            title={selectedContent.title}
            onBack={handleBack}
          >
            <div className="flex items-center gap-3 mb-4">
              <DifficultyBadge difficulty={selectedContent.difficulty} variant="default" />
              {selectedContent.category && (
                <span className="ios-caption text-muted-foreground">{selectedContent.category}</span>
              )}
            </div>

            <div className="ios-card bg-muted/50 mb-4">
              <p className="ios-body leading-relaxed whitespace-pre-wrap">
                {selectedContent.content_text}
              </p>
            </div>

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
          </DetailHeader>

          <div className="ios-card">
            <h3 className="ios-subtitle mb-4">跟读练习</h3>
            <TypingArea
              content={selectedContent.content_text}
              isActive={true}
              onComplete={() => console.log('阅读完成')}
              onReset={handleBack}
            />
          </div>
        </div>
      )}
    </div>
  )
}
