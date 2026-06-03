import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContentStore } from '@/stores/contentStore'
import { Headphones, Mic, BookOpen, PenTool, SpellCheck } from 'lucide-react'

export function Skills() {
  const { contents, fetchContents } = useContentStore()
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  const skillTypes = [
    { value: 'all', label: '全部', icon: null },
    { value: 'listening', label: '听力', icon: Headphones },
    { value: 'speaking', label: '口语', icon: Mic },
    { value: 'reading', label: '阅读', icon: BookOpen },
    { value: 'writing', label: '写作', icon: PenTool },
    { value: 'vocabulary', label: '词汇', icon: SpellCheck },
  ]

  const filteredContents = selectedType === 'all' 
    ? contents 
    : contents.filter(c => c.content_type === selectedType)

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6 animate-ios-fade-in">
        <h1 className="ios-title mb-2">技能学习</h1>
        <p className="ios-body text-muted-foreground">
          选择不同的英语技能进行专项训练
        </p>
      </div>

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
            <Link
              key={content.id}
              to={`/practice?type=${content.content_type}&id=${content.id}`}
              className="ios-card hover:scale-[1.02] transition-all duration-200 animate-ios-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="ios-body font-semibold flex-1">{content.title}</h3>
                <Badge variant="outline" className="ml-2">
                  {content.difficulty === 'easy' ? '简单' : content.difficulty === 'medium' ? '中等' : '困难'}
                </Badge>
              </div>
              <p className="ios-caption text-muted-foreground mb-3 line-clamp-2">
                {content.content_text.substring(0, 100)}...
              </p>
              <div className="flex items-center justify-between">
                <span className="ios-caption text-blue-500">{content.category}</span>
                <span className="ios-caption text-muted-foreground">{content.content_text.length} 字符</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredContents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <p className="ios-body text-muted-foreground">暂无内容</p>
          </div>
        )}
      </Tabs>
    </div>
  )
}