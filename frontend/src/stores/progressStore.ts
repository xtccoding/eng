import { create } from 'zustand'
import { progressAPI } from '@/services/api'

interface ProgressState {
  dashboard: any | null
  history: any[]
  historyTotal: number
  historyPage: number
  historySize: number
  historyPages: number
  achievements: any[]
  achievementsTotal: number
  unlockedCount: number
  wordProgress: any[]
  wordProgressTotal: number
  wordProgressPage: number
  wordProgressSize: number
  wordProgressPages: number
  isLoading: boolean
  error: string | null
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
  
  fetchDashboard: async () => {
    set({ isLoading: true, error: null })
    try {
      const response: any = await progressAPI.getDashboard()
      set({ dashboard: response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  fetchHistory: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { historyPage, historySize } = get()
      const queryParams = {
        page: params?.page || historyPage,
        size: params?.size || historySize,
        content_type: params?.content_type,
      }
      
      const response: any = await progressAPI.getHistory(queryParams)
      set({
        history: response?.sessions || [],
        historyTotal: response?.total || 0,
        historyPage: response?.page || 1,
        historySize: response?.size || 20,
        historyPages: response?.pages || 0,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  fetchAchievements: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const response: any = await progressAPI.getAchievements(params)
      set({
        achievements: response?.achievements || [],
        achievementsTotal: response?.total || 0,
        unlockedCount: response?.unlocked_count || 0,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  unlockAchievement: async (achievementId) => {
    set({ isLoading: true, error: null })
    try {
      await progressAPI.unlockAchievement(achievementId)
      get().fetchAchievements()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  fetchWordProgress: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { wordProgressPage, wordProgressSize } = get()
      const queryParams = {
        page: params?.page || wordProgressPage,
        size: params?.size || wordProgressSize,
        mastery_level: params?.mastery_level,
      }
      
      const response: any = await progressAPI.getWordProgress(queryParams)
      set({
        wordProgress: response?.words || [],
        wordProgressTotal: response?.total || 0,
        wordProgressPage: response?.page || 1,
        wordProgressSize: response?.size || 20,
        wordProgressPages: response?.pages || 0,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  updateWordProgress: async (wordId, isCorrect) => {
    try {
      await progressAPI.updateWordProgress(wordId, isCorrect)
      get().fetchWordProgress()
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))