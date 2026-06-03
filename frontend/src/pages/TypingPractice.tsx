import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TypingArea } from '@/components/typing/TypingArea'
import { StatsPanel } from '@/components/typing/StatsPanel'
import { ContentSelector } from '@/components/content/ContentSelector'
import { useTypingStore } from '@/stores/typingStore'
import { useContentStore } from '@/stores/contentStore'

const tabConfig = [
  { value: 'speech', title: '演讲稿', description: '选择一篇演讲稿开始练习' },
  { value: 'vocabulary', title: '单词', description: '选择一组单词开始练习' },
  { value: 'ielts', title: '雅思', description: '选择雅思阅读或写作材料' },
  { value: 'article', title: '文章', description: '选择一篇文章开始练习' },
]

export function TypingPractice() {
  const [searchParams] = useSearchParams()
  const contentType = searchParams.get('type') || 'speech'

  const {
    currentContent,
    isTyping,
    currentWPM,
    currentAccuracy,
    totalChars,
    correctChars,
    startSession,
    completeSession,
    setCurrentContent,
    resetTyping,
  } = useTypingStore()

  const { contents, fetchContents } = useContentStore()
  const [selectedTab, setSelectedTab] = useState(contentType)

  useEffect(() => {
    fetchContents({ content_type: selectedTab })
  }, [selectedTab, fetchContents])

  const handleStartTyping = (content: any) => {
    setCurrentContent(content)
    startSession(content.id, content.content_type)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">打字练习</h2>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          {tabConfig.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.title}</TabsTrigger>
          ))}
        </TabsList>

        {tabConfig.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>选择{tab.title}</CardTitle>
                  <CardDescription>{tab.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentSelector contents={contents} onSelect={handleStartTyping} />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>练习统计</CardTitle>
                  <CardDescription>当前练习的统计数据</CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsPanel
                    wpm={currentWPM}
                    accuracy={currentAccuracy}
                    totalChars={totalChars}
                    correctChars={correctChars}
                    isTyping={isTyping}
                  />
                </CardContent>
              </Card>
            </div>

            {currentContent && (
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.title}</CardTitle>
                  <CardDescription>{currentContent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <TypingArea
                    content={currentContent.content_text}
                    isActive={isTyping}
                    onComplete={completeSession}
                    onReset={resetTyping}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
