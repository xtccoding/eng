import axios, { AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.detail || '请求失败'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

export default api

// 打字练习相关API
export const typingAPI = {
  startSession: (data: { content_id: number; content_type: string }): Promise<any> =>
    api.post('/typing/start', data),
  
  submitResult: (data: {
    session_id: number
    char_index: number
    expected_char: string
    typed_char: string
    is_correct: boolean
    time_taken: number
  }): Promise<any> => api.post('/typing/submit', data),
  
  completeSession: (sessionId: number): Promise<any> =>
    api.post(`/typing/complete/${sessionId}`),
  
  getSessions: (params?: { page?: number; size?: number; content_type?: string }): Promise<any> =>
    api.get('/typing/sessions', { params }),
  
  getSession: (sessionId: number): Promise<any> =>
    api.get(`/typing/sessions/${sessionId}`),
  
  getStatistics: (): Promise<any> =>
    api.get('/typing/statistics'),
}

// 内容管理相关API
export const contentAPI = {
  getContents: (params?: {
    page?: number
    size?: number
    content_type?: string
    category?: string
    difficulty?: string
  }): Promise<any> => api.get('/content/', { params }),
  
  getContent: (contentId: number): Promise<any> =>
    api.get(`/content/${contentId}`),
  
  createContent: (data: {
    title: string
    content_type: string
    category: string
    difficulty: string
    content_text: string
    translation?: string
    audio_url?: string
    tags?: string[]
    source?: string
  }): Promise<any> => api.post('/content/', data),
  
  updateContent: (contentId: number, data: Partial<{
    title: string
    content_type: string
    category: string
    difficulty: string
    content_text: string
    translation?: string
    audio_url?: string
    tags?: string[]
    source?: string
  }>): Promise<any> => api.put(`/content/${contentId}`, data),
  
  deleteContent: (contentId: number): Promise<any> =>
    api.delete(`/content/${contentId}`),
  
  getContentTypes: (): Promise<any> =>
    api.get('/content/types/'),
  
  getCategories: (): Promise<any> =>
    api.get('/content/categories/'),
  
  searchContents: (data: {
    query: string
    content_type?: string
    category?: string
    difficulty?: string
    page?: number
    size?: number
  }): Promise<any> => api.post('/content/search', data),
}

// 进度跟踪相关API
export const progressAPI = {
  getDashboard: (): Promise<any> =>
    api.get('/progress/dashboard'),
  
  getHistory: (params?: {
    page?: number
    size?: number
    content_type?: string
  }): Promise<any> => api.get('/progress/history', { params }),
  
  getAchievements: (params?: {
    category?: string
    is_unlocked?: boolean
  }): Promise<any> => api.get('/progress/achievements', { params }),
  
  unlockAchievement: (achievementId: number): Promise<any> =>
    api.post(`/progress/achievements/${achievementId}/unlock`),
  
  getWordProgress: (params?: {
    page?: number
    size?: number
    mastery_level?: number
  }): Promise<any> => api.get('/progress/words', { params }),
  
  updateWordProgress: (wordId: number, isCorrect: boolean): Promise<any> =>
    api.post(`/progress/words/${wordId}/update`, { is_correct: isCorrect }),
  
  getLeaderboard: (sortBy: string = 'wpm', limit: number = 10): Promise<any> =>
    api.get('/progress/leaderboard', { params: { sort_by: sortBy, limit } }),
}

// 内容生成相关API
export const generationAPI = {
  searchArticles: (data: {
    query: string
    content_type?: string
    difficulty?: string
    max_results?: number
    language?: string
  }): Promise<any> => api.post('/generation/search', data),
  
  generateContent: (data: {
    topic: string
    content_type: string
    difficulty: string
    length?: number
    language?: string
    include_translation?: boolean
  }): Promise<any> => api.post('/generation/generate', data),
  
  getSuggestions: (params?: {
    content_type?: string
    difficulty?: string
  }): Promise<any> => api.get('/generation/suggestions', { params }),
  
  fetchArticle: (url: string): Promise<any> =>
    api.post('/generation/fetch', null, { params: { url } }),
}

// 导出导入相关API
export const exportAPI = {
  exportData: (data: {
    export_type: string
    include_presets?: boolean
    format?: string
  }): Promise<any> => api.post('/export/export', data),
  
  importData: (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/export/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  downloadExport: (fileName: string): Promise<any> =>
    api.get(`/export/download/${fileName}`, { responseType: 'blob' }),
  
  getExportRecords: (): Promise<any> =>
    api.get('/export/records'),
  
  createBackup: (): Promise<any> =>
    api.post('/export/backup'),
}