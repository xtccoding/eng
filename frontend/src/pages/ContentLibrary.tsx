import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useContentStore } from '@/stores/contentStore'
import { Search, Plus, Filter } from 'lucide-react'

export function ContentLibrary() {
  const {
    contents,
    contentTypes,
    page,
    pages,
    contentTypeFilter,
    isLoading,
    fetchContents,
    fetchContentTypes,
    fetchCategories,
    searchContents,
    setFilters,
    setPage,
    resetFilters,
  } = useContentStore()
  
  const [searchInput, setSearchInput] = useState('')
  
  useEffect(() => {
    fetchContents()
    fetchContentTypes()
    fetchCategories()
  }, [fetchContents, fetchContentTypes, fetchCategories])
  
  const handleSearch = () => {
    if (searchInput.trim()) {
      searchContents(searchInput)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">内容库</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加内容
        </Button>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="搜索内容..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetFilters}>
            <Filter className="mr-2 h-4 w-4" />
            重置筛选
          </Button>
        </div>
      </div>
      
      {/* 内容类型标签 */}
      <Tabs value={contentTypeFilter || 'all'} onValueChange={(value) => setFilters({ contentType: value === 'all' ? null : value })}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          {contentTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">加载中...</div>
          ) : contents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无内容
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contents.map((content) => (
                <Card key={content.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <Badge variant="outline">{content.difficulty}</Badge>
                    </div>
                    <CardDescription>
                      {content.category} • {content.content_type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {content.content_text.substring(0, 150)}...
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {content.tags?.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm">
                        查看详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* 分页 */}
          {pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                上一页
              </Button>
              <span className="flex items-center px-4 text-sm">
                第 {page} 页，共 {pages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pages}
              >
                下一页
              </Button>
            </div>
          )}
        </TabsContent>
        
        {contentTypes.map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            {/* 内容类型特定的内容 */}
            <div className="text-center py-8 text-muted-foreground">
              {type} 类型的内容
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}