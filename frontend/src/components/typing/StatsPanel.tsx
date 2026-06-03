import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatWPM, formatAccuracy } from '@/utils/helpers'

interface StatsPanelProps {
  wpm: number
  accuracy: number
  totalChars: number
  correctChars: number
  isTyping: boolean
}

export function StatsPanel({ wpm, accuracy, totalChars, correctChars, isTyping }: StatsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              速度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatWPM(wpm)}</div>
            <p className="text-xs text-muted-foreground">
              每分钟字数
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              准确率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAccuracy(accuracy)}</div>
            <p className="text-xs text-muted-foreground">
              正确字符比例
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              总字符
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChars}</div>
            <p className="text-xs text-muted-foreground">
              已输入字符数
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              正确字符
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{correctChars}</div>
            <p className="text-xs text-muted-foreground">
              正确输入的字符数
            </p>
          </CardContent>
        </Card>
      </div>
      
      {isTyping && (
        <div className="text-center text-sm text-muted-foreground">
          正在输入中...
        </div>
      )}
    </div>
  )
}