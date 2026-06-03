import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Keyboard, BookOpen, BarChart3, Trophy } from 'lucide-react'

export function Home() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">欢迎使用 Xtcer Tool</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              打字练习
            </CardTitle>
            <Keyboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">开始练习</div>
            <p className="text-xs text-muted-foreground">
              通过打字练习提高英语水平
            </p>
            <Link to="/typing">
              <Button className="mt-4" size="sm">
                开始
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              内容库
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">浏览内容</div>
            <p className="text-xs text-muted-foreground">
              演讲稿、单词表、雅思材料
            </p>
            <Link to="/content">
              <Button className="mt-4" size="sm">
                浏览
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              学习进度
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">查看进度</div>
            <p className="text-xs text-muted-foreground">
              跟踪您的学习进度
            </p>
            <Link to="/progress">
              <Button className="mt-4" size="sm">
                查看
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              成就系统
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">解锁成就</div>
            <p className="text-xs text-muted-foreground">
              完成挑战获得成就
            </p>
            <Link to="/achievements">
              <Button className="mt-4" size="sm">
                查看
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>快速开始</CardTitle>
            <CardDescription>
              选择一种练习方式开始学习
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    演讲稿练习
                  </p>
                  <p className="text-sm text-muted-foreground">
                    通过打字练习经典演讲稿
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <Link to="/typing?type=speech">
                    <Button variant="outline" size="sm">
                      开始
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    单词练习
                  </p>
                  <p className="text-sm text-muted-foreground">
                    通过打字记忆单词
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <Link to="/typing?type=vocabulary">
                    <Button variant="outline" size="sm">
                      开始
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    雅思练习
                  </p>
                  <p className="text-sm text-muted-foreground">
                    雅思阅读和写作练习
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <Link to="/typing?type=ielts">
                    <Button variant="outline" size="sm">
                      开始
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>最近学习</CardTitle>
            <CardDescription>
              您最近的学习记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    暂无学习记录
                  </p>
                  <p className="text-sm text-muted-foreground">
                    开始您的第一次练习吧！
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}