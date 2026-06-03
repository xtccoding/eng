import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Lock, CheckCircle } from 'lucide-react'
import { progressAPI } from '@/services/api'

interface Achievement {
  id: number
  name: string
  description: string
  category: string
  icon: string
  requirement_type: string
  requirement_value: number
  is_unlocked: boolean
  unlocked_at: string | null
}

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        const response = await progressAPI.getAchievements({})
        setAchievements(response?.achievements || [])
      } catch (err) {
        setError('Failed to load achievements')
        console.error('Error fetching achievements:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  const unlockedCount = achievements.filter(a => a.is_unlocked).length
  const totalCount = achievements.length
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  const categories = [...new Set(achievements.map(a => a.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
          <p className="mt-2 text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Trophy className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-2 text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">成就系统</h1>
        <Badge variant="outline" className="text-lg">
          {unlockedCount}/{totalCount} 已解锁
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            总体进度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>解锁进度</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              已解锁 {unlockedCount} 个成就，共 {totalCount} 个
            </p>
          </div>
        </CardContent>
      </Card>

      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category)
        const categoryUnlocked = categoryAchievements.filter(a => a.is_unlocked).length

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category}</span>
                <Badge variant="secondary">
                  {categoryUnlocked}/{categoryAchievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      achievement.is_unlocked 
                        ? 'bg-muted/50 border-primary/20' 
                        : 'bg-muted/20 opacity-70'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {achievement.is_unlocked ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      {achievement.is_unlocked && achievement.unlocked_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          解锁于: {new Date(achievement.unlocked_at).toLocaleDateString()}
                        </p>
                      )}
                      {!achievement.is_unlocked && (
                        <p className="text-xs text-muted-foreground mt-2">
                          需要: {achievement.requirement_value} {achievement.requirement_type}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {achievements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">暂无成就</h3>
            <p className="text-sm text-muted-foreground mt-2">
              完成打字练习和任务来解锁成就
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}