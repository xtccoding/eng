import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Wand2, ExternalLink, BookOpen } from 'lucide-react'
import { generationAPI, contentAPI } from '@/services/api'

export function Generation() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const [generateTopic, setGenerateTopic] = useState('')
  const [generateType, setGenerateType] = useState('article')
  const [generateDifficulty, setGenerateDifficulty] = useState('medium')
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const res = await generationAPI.searchArticles({
        query: searchQuery,
        max_results: 5,
      })
      setSearchResults(res.results || [])
    } catch (e) {
      console.error(e)
    } finally {
      setIsSearching(false)
    }
  }

  const handleGenerate = async () => {
    if (!generateTopic.trim()) return
    setIsGenerating(true)
    try {
      const res = await generationAPI.generateContent({
        topic: generateTopic,
        content_type: generateType,
        difficulty: generateDifficulty,
        length: 500,
        include_translation: true,
      })
      setGeneratedContent(res)
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContent = async (content: any) => {
    try {
      await contentAPI.createContent({
        title: content.title,
        content_type: content.content_type || generateType,
        category: generateTopic,
        difficulty: content.difficulty || generateDifficulty,
        content_text: content.content,
        translation: content.translation,
        tags: content.tags || [generateTopic],
      })
      alert('内容已保存到内容库！')
    } catch (e) {
      console.error(e)
      alert('保存失败')
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">文章生成</h2>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">
            <Wand2 className="mr-2 h-4 w-4" />
            AI生成
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            搜索文章
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>生成学习内容</CardTitle>
              <CardDescription>
                输入主题，AI将生成适合打字练习的英文内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="输入主题，如：Technology, Environment, Travel..."
                  value={generateTopic}
                  onChange={(e) => setGenerateTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <Button onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? '生成中...' : '生成'}
                </Button>
              </div>
              
              <div className="flex gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">内容类型</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'article', label: '文章' },
                      { value: 'speech', label: '演讲稿' },
                      { value: 'vocabulary', label: '单词' },
                      { value: 'ielts', label: '雅思' },
                    ].map((t) => (
                      <Badge
                        key={t.value}
                        variant={generateType === t.value ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setGenerateType(t.value)}
                      >
                        {t.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">难度</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'easy', label: '简单' },
                      { value: 'medium', label: '中等' },
                      { value: 'hard', label: '困难' },
                    ].map((d) => (
                      <Badge
                        key={d.value}
                        variant={generateDifficulty === d.value ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setGenerateDifficulty(d.value)}
                      >
                        {d.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{generatedContent.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge>{generatedContent.content_type}</Badge>
                    <Badge variant="outline">{generatedContent.difficulty}</Badge>
                    <Badge variant="secondary">{generatedContent.word_count} 词</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {generatedContent.content}
                </div>
                
                {generatedContent.translation && (
                  <div>
                    <h4 className="font-medium mb-2">中文翻译</h4>
                    <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm text-muted-foreground">
                      {generatedContent.translation}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button onClick={() => handleSaveContent(generatedContent)}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    保存到内容库
                  </Button>
                  <Button variant="outline" onClick={() => setGeneratedContent(null)}>
                    清除
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>搜索在线文章</CardTitle>
              <CardDescription>
                搜索最新英文文章用于打字练习
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? '搜索中...' : '搜索'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                    <CardDescription>{result.source}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {result.snippet}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          查看原文
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}