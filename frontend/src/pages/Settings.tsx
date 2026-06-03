import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/stores/uiStore'
import { useExportStore } from '@/stores/exportStore'
import { Settings as SettingsIcon, Palette, Volume2, Database, Download, Upload } from 'lucide-react'

export function Settings() {
  const { theme, setTheme } = useUIStore()
  const { exportData, importData, createBackup } = useExportStore()
  
  const [exportType, setExportType] = useState('full')
  const [importFile, setImportFile] = useState<File | null>(null)
  
  const handleExport = async () => {
    await exportData({
      export_type: exportType,
      include_presets: true,
      format: 'json',
    })
  }
  
  const handleImport = async () => {
    if (importFile) {
      await importData(importFile)
      setImportFile(null)
    }
  }
  
  const handleBackup = async () => {
    await createBackup()
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">设置</h2>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            外观
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Volume2 className="mr-2 h-4 w-4" />
            音频
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="mr-2 h-4 w-4" />
            数据
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>主题设置</CardTitle>
              <CardDescription>
                选择您喜欢的主题
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                  >
                    浅色
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                  >
                    深色
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                  >
                    跟随系统
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>发音设置</CardTitle>
              <CardDescription>
                配置发音功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">启用发音</p>
                    <p className="text-sm text-muted-foreground">
                      在打字练习时播放发音
                    </p>
                  </div>
                  <Button variant="outline">启用</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">自动发音</p>
                    <p className="text-sm text-muted-foreground">
                      完成单词后自动播放发音
                    </p>
                  </div>
                  <Button variant="outline">禁用</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">发音引擎</p>
                    <p className="text-sm text-muted-foreground">
                      选择发音引擎
                    </p>
                  </div>
                  <Button variant="outline">Web Speech API</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据导出</CardTitle>
              <CardDescription>
                导出您的学习数据
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={exportType}
                    onChange={(e) => setExportType(e.target.value)}
                  >
                    <option value="full">完整导出</option>
                    <option value="progress">进度导出</option>
                    <option value="content">内容导出</option>
                  </select>
                  <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    导出
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>数据导入</CardTitle>
              <CardDescription>
                导入学习数据
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                  <Button onClick={handleImport} disabled={!importFile}>
                    <Upload className="mr-2 h-4 w-4" />
                    导入
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>备份管理</CardTitle>
              <CardDescription>
                创建和恢复备份
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleBackup}>
                  创建备份
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}