import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useProgressStore } from '@/stores/progressStore'
import { formatDuration, formatWPM, formatAccuracy, formatDate } from '@/utils/helpers'
import { BarChart3, Trophy, Clock, Target, Zap } from 'lucide-react'

export function ProgressDashboard() {
  const {
    dashboard,
    history,
    achievements,
    wordProgress,
    isLoading,
    fetchDashboard,
    fetchHistory,
    fetchAchievements,
    fetchWordProgress,
  } = useProgressStore()
  
  useEffect(() => {
    fetchDashboard()
    fetchHistory()
    fetchAchievements()
    fetchWordProgress()
  }, [fetchDashboard, fetchHistory, fetchAchievements, fetchWordProgress])
  
  if (isLoading) {
    return <div className="flex-1 p-8">加载中...</div>
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">学习进度</h2>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
          <TabsTrigger value="achievements">成就</TabsTrigger>
          <TabsTrigger value="words">单词进度</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* 统计卡片 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  总练习时间
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.user_progress ? formatDuration(dashboard.user_progress.total_practice_time) : '0:00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  累计练习时间
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  平均速度
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.user_progress ? formatWPM(dashboard.user_progress.average_wpm) : '0 WPM'}
                </div>
                <p className="text-xs text-muted-foreground">
                  每分钟字数
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  平均准确率
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.user_progress ? formatAccuracy(dashboard.user_progress.average_accuracy) : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  正确字符比例
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  连续天数
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.user_progress?.current_streak || 0} 天
                </div>
                <p className="text-xs text-muted-foreground">
                  当前连续练习天数
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* 等级和经验 */}
          <Card>
            <CardHeader>
              <CardTitle>等级进度</CardTitle>
              <CardDescription>
                当前等级和经验值
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      等级 {dashboard?.user_progress?.level || 1}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      经验值：{dashboard?.user_progress?.experience || 0}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {dashboard?.user_progress?.level || 1} 级
                  </Badge>
                </div>
                <Progress value={((dashboard?.user_progress?.experience || 0) % 1000) / 10} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  距离下一级还需 {1000 - ((dashboard?.user_progress?.experience || 0) % 1000)} 经验
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* 最近成就 */}
          <Card>
            <CardHeader>
              <CardTitle>最近成就</CardTitle>
              <CardDescription>
                最近解锁的成就
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboard?.achievements?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.achievements.map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {achievement.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Badge variant="outline">
                          +{achievement.experience_reward} 经验
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  暂无成就，继续努力！
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>练习历史</CardTitle>
              <CardDescription>
                您的练习记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((session: any) => (
                    <div key={session.id} className="flex items-center border-b pb-4">
                      <div className="ml-4 space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {session.content_type} 练习
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(session.start_time)} • {formatDuration(session.duration)}
                        </p>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <div>
                          <div className="font-medium">{formatWPM(session.wpm)}</div>
                          <div className="text-muted-foreground">速度</div>
                        </div>
                        <div>
                          <div className="font-medium">{formatAccuracy(session.accuracy)}</div>
                          <div className="text-muted-foreground">准确率</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  暂无练习记录
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>成就系统</CardTitle>
              <CardDescription>
                已解锁 {achievements.filter(a => a.is_unlocked).length} / {achievements.length} 个成就
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={achievement.is_unlocked ? 'border-green-200' : 'opacity-50'}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <Trophy className={`h-5 w-5 ${achievement.is_unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant={achievement.is_unlocked ? 'default' : 'secondary'}>
                          {achievement.is_unlocked ? '已解锁' : '未解锁'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          +{achievement.experience_reward} 经验
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="words" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>单词进度</CardTitle>
              <CardDescription>
                您的单词学习进度
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wordProgress.length > 0 ? (
                <div className="space-y-4">
                  {wordProgress.map((word) => (
                    <div key={word.id} className="flex items-center border-b pb-4">
                      <div className="ml-4 space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {word.word}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {word.translation}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <div className="font-medium">{formatAccuracy(word.accuracy)}</div>
                          <div className="text-muted-foreground">准确率</div>
                        </div>
                        <Badge variant="outline">
                          掌握程度：{word.mastery_level}/5
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  暂无单词进度
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}