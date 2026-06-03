import { create } from 'zustand'
import { progressAPI } from '@/services/api'

interface ProgressState {
  // 仪表板数据
  dashboard: any | null
  
  // 历史记录
  history: any[]
  historyTotal: number
  historyPage: number
  historySize: number
  historyPages: number
  
  // 成就
  achievements: any[]
  achievementsTotal: number
  unlockedCount: number
  
  // 单词进度
  wordProgress: any[]
  wordProgressTotal: number
  wordProgressPage: number
  wordProgressSize: number
  wordProgressPages: number
  
  // 加载状态
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchDashboard: () => Promise<void>
  fetchHistory: (params?: {
    page?: number
    size?: number
    content_type?: string
  }) => Promise<void>
  fetchAchievements: (params?: {
    category?: string
    is_unlocked?: boolean
  }) => Promise<void>
  unlockAchievement: (achievementId: number) => Promise<void>
  fetchWordProgress: (params?: {
    page?: number
    size?: number
    mastery_level?: number
  }) => Promise<void>
  updateWordProgress: (wordId: number, isCorrect: boolean) => Promise<void>
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  // 初始状态
  dashboard: null,
  history: [],
  historyTotal: 0,
  historyPage: 1,
  historySize: 20,
  historyPages: 0,
  achievements: [],
  achievementsTotal: 0,
  unlockedCount: 0,
  wordProgress: [],
  wordProgressTotal: 0,
  wordProgressPage: 1,
  wordProgressSize: 20,
  wordProgressPages: 0,
  isLoading: false,
  error: null,
  
  // 获取仪表板数据
  fetchDashboard: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressAPI.getDashboard()
      set({ dashboard: response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 获取历史记录
  fetchHistory: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { historyPage, historySize } = get()
      const queryParams = {
        page: params?.page || historyPage,
        size: params?.size || historySize,
        content_type: params?.content_type,
      }
      
      const response = await progressAPI.getHistory(queryParams)
      set({
        history: response.sessions,
        historyTotal: response.total,
        historyPage: response.page,
        historySize: response.size,
        historyPages: response.pages,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 获取成就列表
  fetchAchievements: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressAPI.getAchievements(params)
      set({
        achievements: response.achievements,
        achievementsTotal: response.total,
        unlockedCount: response.unlocked_count,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 解锁成就
  unlockAchievement: async (achievementId) => {
    set({ isLoading: true, error: null })
    try {
      await progressAPI.unlockAchievement(achievementId)
      // 刷新成就列表
      get().fetchAchievements()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 获取单词进度
  fetchWordProgress: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { wordProgressPage, wordProgressSize } = get()
      const queryParams = {
        page: params?.page || wordProgressPage,
        size: params?.size || wordProgressSize,
        mastery_level: params?.mastery_level,
      }
      
      const response = await progressAPI.getWordProgress(queryParams)
      set({
        wordProgress: response.words,
        wordProgressTotal: response.total,
        wordProgressPage: response.page,
        wordProgressSize: response.size,
        wordProgressPages: response.pages,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 更新单词进度
  updateWordProgress: async (wordId, isCorrect) => {
    try {
      await progressAPI.updateWordProgress(wordId, isCorrect)
      // 刷新单词进度
      get().fetchWordProgress()
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))