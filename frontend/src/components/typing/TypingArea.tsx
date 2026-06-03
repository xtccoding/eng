import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useTypingStore } from '@/stores/typingStore'
import { cn } from '@/utils/helpers'

interface Particle {
  id: number
  x: number
  y: number
  char: string
  color: string
  velocity: { x: number; y: number }
  life: number
}

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
  const [particles, setParticles] = useState<Particle[]>([])
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [hitEffect, setHitEffect] = useState<{ x: number; y: number; correct: boolean } | null>(null)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const particleIdRef = useRef(0)
  const { submitResult } = useTypingStore()

  // 播放音效
  const playSound = useCallback((correct: boolean) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      if (correct) {
        oscillator.frequency.setValueAtTime(800 + combo * 50, audioContext.currentTime)
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      } else {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.type = 'sawtooth'
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      }
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (e) {
      // 静默处理音频错误
    }
  }, [combo])

  // 创建粒子效果
  const createParticles = useCallback((x: number, y: number, correct: boolean) => {
    const newParticles: Particle[] = []
    const count = correct ? 5 : 3
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        char: correct ? '✦' : '✕',
        color: correct ? '#22c55e' : '#ef4444',
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: -Math.random() * 6 - 2,
        },
        life: 1,
      })
    }
    
    setParticles(prev => [...prev, ...newParticles])
    
    // 清除粒子
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)))
    }, 500)
  }, [])

  // 重置状态
  const reset = useCallback(() => {
    setCurrentPosition(0)
    setTypedChars([])
    setErrors([])
    setStartTime(null)
    setIsCompleted(false)
    setCombo(0)
    setMaxCombo(0)
    setParticles([])
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }, [])
  
  // 当内容变化时重置
  useEffect(() => {
    reset()
  }, [content, reset])
  
  // 处理键盘输入
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive || isCompleted) return
    
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
    
    // 播放音效
    playSound(isCorrect)
    
    // 创建打击效果
    if (contentRef.current) {
      const charElements = contentRef.current.querySelectorAll('span')
      const currentCharElement = charElements[currentPosition]
      if (currentCharElement) {
        const rect = currentCharElement.getBoundingClientRect()
        const containerRect = contentRef.current.getBoundingClientRect()
        const x = rect.left - containerRect.left + rect.width / 2
        const y = rect.top - containerRect.top + rect.height / 2
        
        createParticles(x, y, isCorrect)
        setHitEffect({ x, y, correct: isCorrect })
        setTimeout(() => setHitEffect(null), 150)
      }
    }
    
    // 震动效果
    if (!isCorrect) {
      setShakeIntensity(5)
      setTimeout(() => setShakeIntensity(0), 100)
    }
    
    // 更新状态
    setTypedChars([...typedChars, key])
    if (!isCorrect) {
      setErrors([...errors, currentPosition])
    }
    
    const newPosition = currentPosition + 1
    setCurrentPosition(newPosition)
    
    // 检查是否完成
    if (newPosition >= content.length) {
      setIsCompleted(true)
      onComplete()
    }
  }, [isActive, isCompleted, startTime, currentPosition, typedChars, errors, content, submitResult, onComplete, combo, playSound, createParticles])
  
  // 计算进度
  const progress = content.length > 0 ? (currentPosition / content.length) * 100 : 0
  
  // 计算实时WPM
  const [currentWPM, setCurrentWPM] = useState(0)
  useEffect(() => {
    if (startTime && currentPosition > 0) {
      const elapsed = (Date.now() - startTime) / 1000 / 60
      if (elapsed > 0) {
        const correctCount = currentPosition - errors.length
        setCurrentWPM(Math.round((correctCount / 5) / elapsed))
      }
    }
  }, [currentPosition, startTime, errors])
  
  // 渲染内容
  const renderContent = () => {
    return content.split('').map((char, index) => {
      let className = ''
      
      if (index < currentPosition) {
        // 已输入的字符
        className = errors.includes(index) ? 'typing-incorrect' : 'typing-correct'
      } else if (index === currentPosition) {
        // 当前字符
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
          {char}
        </span>
      )
    })
  }
  
  return (
    <div className="space-y-4">
      {/* 实时统计栏 - 可隐藏 */}
      {startTime && !isCompleted && (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{currentWPM}</div>
              <div className="text-xs text-muted-foreground">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {currentPosition > 0 ? Math.round(((currentPosition - errors.length) / currentPosition) * 100) : 100}%
              </div>
              <div className="text-xs text-muted-foreground">准确率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{currentPosition}/{content.length}</div>
              <div className="text-xs text-muted-foreground">进度</div>
            </div>
          </div>
          
          {/* 连击显示 */}
          {combo > 2 && (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="text-3xl font-bold text-orange-500">{combo}</div>
              <div className="text-sm text-orange-400">连击!</div>
            </div>
          )}
        </div>
      )}
      
      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>进度</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* 内容显示区域 */}
      <div
        ref={contentRef}
        className={cn(
          "relative p-6 bg-muted rounded-lg min-h-[200px] font-mono text-lg leading-relaxed cursor-text overflow-hidden",
          shakeIntensity > 0 && "animate-shake"
        )}
        style={{
          transform: shakeIntensity > 0 ? `translate(${Math.random() * shakeIntensity - shakeIntensity/2}px, ${Math.random() * shakeIntensity - shakeIntensity/2}px)` : undefined,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {renderContent()}
        
        {/* 打击效果 */}
        {hitEffect && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: hitEffect.x,
              top: hitEffect.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full animate-ping",
                hitEffect.correct ? "bg-green-500/50" : "bg-red-500/50"
              )}
            />
          </div>
        )}
        
        {/* 粒子效果 */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none animate-float"
            style={{
              left: particle.x,
              top: particle.y,
              color: particle.color,
              fontSize: '16px',
              animation: `float 0.5s ease-out forwards`,
              transform: `translate(${particle.velocity.x * 20}px, ${particle.velocity.y * 20}px)`,
              opacity: 0,
            }}
          >
            {particle.char}
          </div>
        ))}
      </div>
      
      {/* 隐藏的输入框 */}
      <input
        ref={inputRef}
        type="text"
        className="sr-only"
        onKeyDown={handleKeyDown}
        autoFocus
        disabled={!isActive || isCompleted}
      />
      
      {/* 控制按钮 */}
      <div className="flex space-x-2">
        {!isCompleted ? (
          <Button
            onClick={() => inputRef.current?.focus()}
            disabled={!isActive}
          >
            {isActive ? '正在输入...' : '请先选择内容'}
          </Button>
        ) : (
          <Button onClick={onReset}>
            重新开始
          </Button>
        )}
        
        <Button variant="outline" onClick={reset}>
          重置
        </Button>
      </div>
      
      {/* 完成提示 */}
      {isCompleted && (
        <div className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border">
          <h3 className="text-xl font-bold text-green-500 mb-2">恭喜完成！</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{currentWPM}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{Math.round(((currentPosition - errors.length) / currentPosition) * 100)}%</div>
              <div className="text-sm text-muted-foreground">准确率</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{maxCombo}</div>
              <div className="text-sm text-muted-foreground">最大连击</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{errors.length}</div>
              <div className="text-sm text-muted-foreground">错误数</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}