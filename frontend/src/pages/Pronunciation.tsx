import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Volume2, Mic, Square, Play, RotateCcw } from 'lucide-react'

interface PronunciationExercise {
  id: number
  word: string
  phonetic: string
  example: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const sampleExercises: PronunciationExercise[] = [
  {
    id: 1,
    word: 'pronunciation',
    phonetic: '/prəˌnʌn.siˈeɪ.ʃən/',
    example: 'The pronunciation of this word is tricky.',
    difficulty: 'medium'
  },
  {
    id: 2,
    word: 'entrepreneur',
    phonetic: '/ˌɒn.trə.prəˈnɜːr/',
    example: 'She is a successful entrepreneur.',
    difficulty: 'hard'
  },
  {
    id: 3,
    word: 'beautiful',
    phonetic: '/ˈbjuː.tɪ.fəl/',
    example: 'What a beautiful day!',
    difficulty: 'easy'
  },
  {
    id: 4,
    word: 'technology',
    phonetic: '/tekˈnɒl.ə.dʒi/',
    example: 'Technology is changing rapidly.',
    difficulty: 'easy'
  },
  {
    id: 5,
    word: 'specifically',
    phonetic: '/spəˈsɪf.ɪ.kəl.i/',
    example: 'I specifically asked for no sugar.',
    difficulty: 'medium'
  }
]

export function Pronunciation() {
  const [exercises] = useState<PronunciationExercise[]>(sampleExercises)
  const [currentExercise, setCurrentExercise] = useState<PronunciationExercise>(exercises[0])
  const [isRecording, setIsRecording] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    } else {
      setFeedback({ type: 'error', message: 'Your browser does not support speech synthesis' })
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setFeedback({ type: 'info', message: 'Recording started... Speak the word clearly.' })
    
    // Simulate recording for demo purposes
    setTimeout(() => {
      setIsRecording(false)
      setFeedback({ type: 'info', message: 'Recording stopped. Processing...' })
      
      // Simulate processing delay
      setTimeout(() => {
        // For demo, we'll just mark it as correct
        setFeedback({ type: 'success', message: 'Good pronunciation! Keep practicing.' })
        setCompletedExercises(prev => new Set([...prev, currentExercise.id]))
      }, 1000)
    }, 2000)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const checkSpelling = () => {
    if (userInput.toLowerCase().trim() === currentExercise.word.toLowerCase()) {
      setFeedback({ type: 'success', message: 'Correct spelling! Now try pronouncing it.' })
    } else {
      setFeedback({ type: 'error', message: `Incorrect. The correct spelling is: ${currentExercise.word}` })
    }
  }

  const nextExercise = () => {
    const currentIndex = exercises.findIndex(e => e.id === currentExercise.id)
    const nextIndex = (currentIndex + 1) % exercises.length
    setCurrentExercise(exercises[nextIndex])
    setUserInput('')
    setFeedback(null)
  }

  const resetExercise = () => {
    setUserInput('')
    setFeedback(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">发音练习</h1>
        <Badge variant="outline" className="text-lg">
          {completedExercises.size}/{exercises.length} 已完成
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              当前练习
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold">{currentExercise.word}</h2>
              <p className="text-lg text-muted-foreground">{currentExercise.phonetic}</p>
              <Badge className={getDifficultyColor(currentExercise.difficulty)}>
                {currentExercise.difficulty}
              </Badge>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">例句:</p>
              <p className="text-muted-foreground italic">"{currentExercise.example}"</p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => speakWord(currentExercise.word)}
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" />
                听发音
              </Button>
              <Button 
                onClick={() => speakWord(currentExercise.example)}
                variant="outline"
                className="flex-1"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                听例句
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              练习发音
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">跟读单词:</p>
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="flex-1">
                    <Mic className="mr-2 h-4 w-4" />
                    开始录音
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" className="flex-1">
                    <Square className="mr-2 h-4 w-4" />
                    停止录音
                  </Button>
                )}
              </div>
              {isRecording && (
                <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
                  <div className="animate-pulse flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600">录音中...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">拼写检查:</p>
              <div className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="输入单词拼写"
                  onKeyPress={(e) => e.key === 'Enter' && checkSpelling()}
                />
                <Button onClick={checkSpelling}>检查</Button>
              </div>
            </div>

            {feedback && (
              <div className={`p-3 rounded-lg ${
                feedback.type === 'success' ? 'bg-green-50 text-green-800' :
                feedback.type === 'error' ? 'bg-red-50 text-red-800' :
                'bg-blue-50 text-blue-800'
              }`}>
                {feedback.message}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={nextExercise} className="flex-1">
                下一个
              </Button>
              <Button onClick={resetExercise} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                重置
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>练习列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map(exercise => (
              <div
                key={exercise.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  currentExercise.id === exercise.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                } ${completedExercises.has(exercise.id) ? 'bg-green-50 border-green-200' : ''}`}
                onClick={() => {
                  setCurrentExercise(exercise)
                  setUserInput('')
                  setFeedback(null)
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{exercise.word}</span>
                  {completedExercises.has(exercise.id) && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      已完成
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{exercise.phonetic}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}