import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContentStore } from '@/stores/contentStore'
import { PageHeader, EmptyState, ContentCard } from '@/components/common'
import { Headphones, Mic, BookOpen, PenTool, SpellCheck } from 'lucide-react'

const skillTypes = [
  { value: 'all', label: '全部', icon: null },
  { value: 'listening', label: '听力', icon: Headphones },
  { value: 'speaking', label: '口语', icon: Mic },
  { value: 'reading', label: '阅读', icon: BookOpen },
  { value: 'writing', label: '写作', icon: PenTool },
  { value: 'vocabulary', label: '词汇', icon: SpellCheck },
]

export function Skills() {
  const { contents, fetchContents } = useContentStore()
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  const filteredContents = selectedType === 'all'
    ? contents
    : contents.filter(c => c.content_type === selectedType)

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <PageHeader
        title="技能学习"
        subtitle="选择不同的英语技能进行专项训练"
      />

      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="mb-6 bg-transparent gap-2">
          {skillTypes.map(type => (
            <TabsTrigger
              key={type.value}
              value={type.value}
              className="ios-badge data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              {type.icon && <type.icon className="h-4 w-4 mr-1" />}
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((content, index) => (
            <Link key={content.id} to={`/practice?type=${content.content_type}&id=${content.id}`}>
              <ContentCard
                title={content.title}
                difficulty={content.difficulty}
                snippet={content.content_text}
                snippetLength={100}
                animationIndex={index}
                className="h-full"
              >
                <div className="flex items-center justify-between">
                  <span className="ios-caption text-blue-500">{content.category}</span>
                  <span className="ios-caption text-muted-foreground">{content.content_text.length} 字符</span>
                </div>
              </ContentCard>
            </Link>
          ))}
          {filteredContents.length === 0 && <EmptyState icon="📚" message="暂无内容" />}
        </div>
      </Tabs>
    </div>
  )
}
