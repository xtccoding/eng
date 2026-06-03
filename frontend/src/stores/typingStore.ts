import { create } from 'zustand'
import { typingAPI } from '@/services/api'

interface TypingState {
  // 当前练习状态
  currentSession: any | null
  currentContent: any | null
  isTyping: boolean
  startTime: number | null
  
  // 打字统计
  currentWPM: number
  currentAccuracy: number
  totalChars: number
  correctChars: number
  incorrectChars: number
  
  // 练习历史
  sessions: any[]
  statistics: any | null
  
  // 加载状态
  isLoading: boolean
  error: string | null
  
  // Actions
  startSession: (contentId: number, contentType: string) => Promise<void>
  submitResult: (result: {
    char_index: number
    expected_char: string
    typed_char: string
    is_correct: boolean
    time_taken: number
  }) => Promise<void>
  completeSession: () => Promise<void>
  fetchSessions: (params?: { page?: number; size?: number; content_type?: string }) => Promise<void>
  fetchStatistics: () => Promise<void>
  setCurrentContent: (content: any) => void
  resetTyping: () => void
  updateStats: (stats: { wpm: number; accuracy: number; totalChars: number; correctChars: number }) => void
}

export const useTypingStore = create<TypingState>((set, get) => ({
  // 初始状态
  currentSession: null,
  currentContent: null,
  isTyping: false,
  startTime: null,
  currentWPM: 0,
  currentAccuracy: 100,
  totalChars: 0,
  correctChars: 0,
  incorrectChars: 0,
  sessions: [],
  statistics: null,
  isLoading: false,
  error: null,
  
  // 开始练习会话
  startSession: async (contentId: number, contentType: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await typingAPI.startSession({
        content_id: contentId,
        content_type: contentType,
      })
      set({
        currentSession: response,
        isTyping: true,
        startTime: Date.now(),
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 提交打字结果
  submitResult: async (result) => {
    const { currentSession } = get()
    if (!currentSession) return
    
    try {
      await typingAPI.submitResult({
        session_id: currentSession.id,
        ...result,
      })
      
      // 更新本地统计
      const { totalChars, correctChars, incorrectChars } = get()
      const newTotalChars = totalChars + 1
      const newCorrectChars = result.is_correct ? correctChars + 1 : correctChars
      const newIncorrectChars = result.is_correct ? incorrectChars : incorrectChars + 1
      const accuracy = (newCorrectChars / newTotalChars) * 100
      
      // 计算WPM
      const { startTime } = get()
      let wpm = 0
      if (startTime) {
        const duration = (Date.now() - startTime) / 1000 / 60 // 分钟
        if (duration > 0) {
          wpm = (newCorrectChars / 5) / duration
        }
      }
      
      set({
        totalChars: newTotalChars,
        correctChars: newCorrectChars,
        incorrectChars: newIncorrectChars,
        currentAccuracy: accuracy,
        currentWPM: wpm,
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  // 完成练习会话
  completeSession: async () => {
    const { currentSession } = get()
    if (!currentSession) return
    
    set({ isLoading: true, error: null })
    try {
      await typingAPI.completeSession(currentSession.id)
      set({
        currentSession: null,
        isTyping: false,
        startTime: null,
        isLoading: false,
      })
      // 刷新历史记录
      get().fetchSessions()
      get().fetchStatistics()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 获取练习历史
  fetchSessions: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const response = await typingAPI.getSessions(params)
      set({ sessions: response.sessions, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 获取统计信息
  fetchStatistics: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await typingAPI.getStatistics()
      set({ statistics: response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 设置当前内容
  setCurrentContent: (content) => {
    set({ currentContent: content })
  },
  
  // 重置打字状态
  resetTyping: () => {
    set({
      currentSession: null,
      currentContent: null,
      isTyping: false,
      startTime: null,
      currentWPM: 0,
      currentAccuracy: 100,
      totalChars: 0,
      correctChars: 0,
      incorrectChars: 0,
    })
  },
  
  // 更新统计信息
  updateStats: (stats) => {
    set({
      currentWPM: stats.wpm,
      currentAccuracy: stats.accuracy,
      totalChars: stats.totalChars,
      correctChars: stats.correctChars,
    })
  },
}))