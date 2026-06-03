import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { progressAPI } from '@/services/api'
import { formatWPM, formatAccuracy, formatDuration, formatDateTime } from '@/utils/helpers'
import { Trophy, Zap, Target, Clock, Medal } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  id: number
  content_type: string
  wpm: number
  accuracy: number
  total_chars: number
  correct_chars: number
  duration: number
  start_time: string | null
}

export function Leaderboard() {
  const [sortBy, setSortBy] = useState('wpm')
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const res = await progressAPI.getLeaderboard(sortBy, 20)
      setRankings(res.rankings || [])
      setTotal(res.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
      case 2:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/50'
      case 3:
        return 'bg-amber-600/20 text-amber-600 border-amber-600/50'
      default:
        return ''
    }
  }

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      speech: '演讲稿',
      vocabulary: '单词',
      ielts: '雅思',
      article: '文章',
    }
    return labels[type] || type
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">排行榜</h2>
        <Badge variant="outline">共 {total} 次练习</Badge>
      </div>

      <Tabs value={sortBy} onValueChange={setSortBy}>
        <TabsList>
          <TabsTrigger value="wpm">
            <Zap className="mr-2 h-4 w-4" />
            速度排行
          </TabsTrigger>
          <TabsTrigger value="accuracy">
            <Target className="mr-2 h-4 w-4" />
            准确率排行
          </TabsTrigger>
          <TabsTrigger value="chars">
            <Clock className="mr-2 h-4 w-4" />
            字数排行
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wpm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>速度排行榜</CardTitle>
              <CardDescription>按打字速度（WPM）排名</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">加载中...</div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无记录，开始练习吧！
                </div>
              ) : (
                <div className="space-y-2">
                  {rankings.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center p-3 rounded-lg border transition-colors hover:bg-muted/50 ${getRankBadgeColor(entry.rank)}`}
                    >
                      <div className="w-10 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {getContentTypeLabel(entry.content_type)}练习
                          </span>
                          <Badge variant="outline" className="text-xs">
                            #{entry.id}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.start_time ? formatDateTime(entry.start_time) : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">{Math.round(entry.wpm)}</div>
                          <div className="text-xs text-muted-foreground">WPM</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">{Math.round(entry.accuracy)}%</div>
                          <div className="text-xs text-muted-foreground">准确率</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{entry.total_chars}</div>
                          <div className="text-xs text-muted-foreground">字符</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>准确率排行榜</CardTitle>
              <CardDescription>按打字准确率排名</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">加载中...</div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无记录，开始练习吧！
                </div>
              ) : (
                <div className="space-y-2">
                  {rankings.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center p-3 rounded-lg border transition-colors hover:bg-muted/50 ${getRankBadgeColor(entry.rank)}`}
                    >
                      <div className="w-10 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {getContentTypeLabel(entry.content_type)}练习
                          </span>
                          <Badge variant="outline" className="text-xs">
                            #{entry.id}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.start_time ? formatDateTime(entry.start_time) : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">{Math.round(entry.accuracy)}%</div>
                          <div className="text-xs text-muted-foreground">准确率</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">{Math.round(entry.wpm)}</div>
                          <div className="text-xs text-muted-foreground">WPM</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{entry.total_chars}</div>
                          <div className="text-xs text-muted-foreground">字符</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>字数排行榜</CardTitle>
              <CardDescription>按输入字符数排名</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">加载中...</div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无记录，开始练习吧！
                </div>
              ) : (
                <div className="space-y-2">
                  {rankings.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center p-3 rounded-lg border transition-colors hover:bg-muted/50 ${getRankBadgeColor(entry.rank)}`}
                    >
                      <div className="w-10 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {getContentTypeLabel(entry.content_type)}练习
                          </span>
                          <Badge variant="outline" className="text-xs">
                            #{entry.id}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.start_time ? formatDateTime(entry.start_time) : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold">{entry.total_chars}</div>
                          <div className="text-xs text-muted-foreground">总字符</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">{entry.correct_chars}</div>
                          <div className="text-xs text-muted-foreground">正确</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">{Math.round(entry.wpm)}</div>
                          <div className="text-xs text-muted-foreground">WPM</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}