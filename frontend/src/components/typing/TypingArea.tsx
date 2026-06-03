import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useTypingStore } from '@/stores/typingStore'
import { cn } from '@/utils/helpers'

interface TypingAreaProps {
  content: string
  isActive: boolean
  onComplete: () => void
  onReset: () => void
}

export function TypingArea({ content, isActive, onComplete, onReset }: TypingAreaProps) {
  const [currentPosition, setCurrentPosition] = useState(0)
  const [typedChars, setTypedChars] = useState<string[]>([])
  const [errors, setErrors] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [currentWPM, setCurrentWPM] = useState(0)
  const [currentAccuracy, setCurrentAccuracy] = useState(100)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const wpmIntervalRef = useRef<number | null>(null)
  const { submitResult } = useTypingStore()

  // 重置状态
  const reset = useCallback(() => {
    setCurrentPosition(0)
    setTypedChars([])
    setErrors([])
    setStartTime(null)
    setIsCompleted(false)
    setCombo(0)
    setMaxCombo(0)
    setCurrentWPM(0)
    setCurrentAccuracy(100)
    if (wpmIntervalRef.current) {
      clearInterval(wpmIntervalRef.current)
      wpmIntervalRef.current = null
    }
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }, [])
  
  // 当内容变化时重置
  useEffect(() => {
    reset()
  }, [content, reset])
  
  // 实时更新WPM
  useEffect(() => {
    if (startTime && !isCompleted) {
      wpmIntervalRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000 / 60
        if (elapsed > 0) {
          const correctCount = currentPosition - errors.length
          setCurrentWPM(Math.round((correctCount / 5) / elapsed))
        }
      }, 100)
    }
    return () => {
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current)
      }
    }
  }, [startTime, isCompleted, currentPosition, errors])
  
  // 处理键盘输入
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) return
    
    // 开始计时
    if (!startTime) {
      setStartTime(Date.now())
    }
    
    const key = e.key
    
    // 忽略功能键
    if (key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta') {
      return
    }
    
    // 处理退格键
    if (key === 'Backspace') {
      if (currentPosition > 0) {
        setCurrentPosition(currentPosition - 1)
        setTypedChars(typedChars.slice(0, -1))
        setErrors(errors.filter(i => i !== currentPosition - 1))
      }
      return
    }
    
    // 忽略其他非字符键
    if (key.length !== 1) {
      return
    }
    
    const expectedChar = content[currentPosition]
    const isCorrect = key === expectedChar
    
    // 记录结果
    const result = {
      char_index: currentPosition,
      expected_char: expectedChar,
      typed_char: key,
      is_correct: isCorrect,
      time_taken: startTime ? Date.now() - startTime : 0,
    }
    
    submitResult(result)
    
    // 更新连击
    if (isCorrect) {
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo(prev => Math.max(prev, newCombo))
    } else {
      setCombo(0)
    }
    
    // 更新状态
    const newTypedChars = [...typedChars, key]
    const newErrors = isCorrect ? errors : [...errors, currentPosition]
    const newPosition = currentPosition + 1
    
    setTypedChars(newTypedChars)
    if (!isCorrect) {
      setErrors(newErrors)
    }
    setCurrentPosition(newPosition)
    
    // 更新准确率
    const newAccuracy = Math.round(((newPosition - newErrors.length) / newPosition) * 100)
    setCurrentAccuracy(newAccuracy)
    
    // 检查是否完成
    if (newPosition >= content.length) {
      setIsCompleted(true)
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current)
      }
      onComplete()
    }
  }, [isCompleted, startTime, currentPosition, typedChars, errors, content, submitResult, onComplete, combo])
  
  // 计算进度
  const progress = content.length > 0 ? (currentPosition / content.length) * 100 : 0
  
  // 渲染内容
  const renderContent = () => {
    return content.split('').map((char, index) => {
      let className = ''
      
      if (index < currentPosition) {
        className = errors.includes(index) ? 'typing-incorrect' : 'typing-correct'
      } else if (index === currentPosition) {
        className = 'typing-current'
      }
      
      return (
        <span
          key={index}
          className={cn(
            'text-lg font-mono transition-all duration-75',
            className
          )}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      )
    })
  }
  
  return (
    <div className="space-y-4">
      {/* 实时统计栏 */}
      {startTime && !isCompleted && (
        <div className="ios-card animate-ios-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="ios-stat-value text-blue-500">{currentWPM}</div>
                <div className="ios-stat-label">WPM</div>
              </div>
              <div className="text-center">
                <div className="ios-stat-value text-green-500">{currentAccuracy}%</div>
                <div className="ios-stat-label">准确率</div>
              </div>
              <div className="text-center">
                <div className="ios-stat-value text-purple-500">{currentPosition}/{content.length}</div>
                <div className="ios-stat-label">进度</div>
              </div>
            </div>
            
            {/* 连击显示 */}
            {combo > 2 && (
              <div className="flex items-center gap-2 combo-flash">
                <div className="ios-stat-value text-orange-500">{combo}</div>
                <div className="ios-caption text-orange-400">连击!</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="ios-caption">进度</span>
          <span className="ios-caption font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="ios-progress">
          <div className="ios-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      {/* 内容显示区域 */}
      <div
        ref={contentRef}
        className={cn(
          "relative p-6 min-h-[200px] font-mono text-lg leading-relaxed cursor-text overflow-hidden",
          "bg-gray-50 dark:bg-gray-900/50 rounded-2xl",
          "whitespace-pre-wrap break-words",
          combo > 5 && "ios-shake"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {renderContent()}
      </div>
      
      {/* 隐藏的输入框 */}
      <input
        ref={inputRef}
        type="text"
        className="sr-only"
        onKeyDown={handleKeyDown}
        autoFocus
        disabled={isCompleted}
      />
      
      {/* 控制按钮 */}
      <div className="flex gap-3">
        {!isCompleted ? (
          <button
            className="ios-button flex-1"
            onClick={() => inputRef.current?.focus()}
          >
            {startTime ? '正在输入...' : '点击开始'}
          </button>
        ) : (
          <button className="ios-button flex-1" onClick={onReset}>
            重新开始
          </button>
        )}
        
        <button className="ios-button-secondary" onClick={reset}>
          重置
        </button>
      </div>
      
      {/* 完成结果 */}
      {isCompleted && (
        <div className="ios-card animate-ios-slide-up">
          <h3 className="ios-subtitle text-green-500 mb-4">练习完成</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="ios-stat-value text-blue-500">{currentWPM}</div>
              <div className="ios-stat-label">WPM</div>
            </div>
            <div className="text-center">
              <div className="ios-stat-value text-green-500">{currentAccuracy}%</div>
              <div className="ios-stat-label">准确率</div>
            </div>
            <div className="text-center">
              <div className="ios-stat-value text-orange-500">{maxCombo}</div>
              <div className="ios-stat-label">最大连击</div>
            </div>
            <div className="text-center">
              <div className="ios-stat-value text-red-500">{errors.length}</div>
              <div className="ios-stat-label">错误数</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}