import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ContentSelectorProps {
  contents: any[]
  onSelect: (content: any) => void
}

export function ContentSelector({ contents, onSelect }: ContentSelectorProps) {
  if (contents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        暂无内容，请先添加内容
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {contents.map((content) => (
        <Card key={content.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{content.title}</CardTitle>
              <Badge variant="outline">{content.difficulty}</Badge>
            </div>
            <CardDescription>
              {content.category} • {content.content_type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {content.content_text.substring(0, 100)}...
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-2">
                {content.tags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button size="sm" onClick={() => onSelect(content)}>
                开始练习
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}