import { create } from 'zustand'
import { contentAPI } from '@/services/api'

interface ContentState {
  // 内容列表
  contents: any[]
  currentContent: any | null
  contentTypes: string[]
  categories: string[]
  
  // 分页和过滤
  page: number
  size: number
  total: number
  pages: number
  
  // 搜索和过滤条件
  contentTypeFilter: string | null
  categoryFilter: string | null
  difficultyFilter: string | null
  searchQuery: string
  
  // 加载状态
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchContents: (params?: {
    page?: number
    size?: number
    content_type?: string
    category?: string
    difficulty?: string
  }) => Promise<void>
  fetchContent: (contentId: number) => Promise<void>
  createContent: (data: any) => Promise<void>
  updateContent: (contentId: number, data: any) => Promise<void>
  deleteContent: (contentId: number) => Promise<void>
  fetchContentTypes: () => Promise<void>
  fetchCategories: () => Promise<void>
  searchContents: (query: string) => Promise<void>
  setFilters: (filters: {
    contentType?: string | null
    category?: string | null
    difficulty?: string | null
  }) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

export const useContentStore = create<ContentState>((set, get) => ({
  // 初始状态
  contents: [],
  currentContent: null,
  contentTypes: [],
  categories: [],
  page: 1,
  size: 20,
  total: 0,
  pages: 0,
  contentTypeFilter: null,
  categoryFilter: null,
  difficultyFilter: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  
  // 获取内容列表
  fetchContents: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { page, size, contentTypeFilter, categoryFilter, difficultyFilter } = get()
      const queryParams = {
        page: params?.page || page,
        size: params?.size || size,
        content_type: params?.content_type || contentTypeFilter,
        category: params?.category || categoryFilter,
        difficulty: params?.difficulty || difficultyFilter,
      }
      
      const response = await contentAPI.getContents(queryParams)
      set({
        contents: response.contents,
        total: response.total,
        page: response.page,
        size: response.size,
        pages: response.pages,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 获取单个内容
  fetchContent: async (contentId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await contentAPI.getContent(contentId)
      set({ currentContent: response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 创建内容
  createContent: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await contentAPI.createContent(data)
      // 刷新列表
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 更新内容
  updateContent: async (contentId, data) => {
    set({ isLoading: true, error: null })
    try {
      await contentAPI.updateContent(contentId, data)
      // 刷新列表
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 删除内容
  deleteContent: async (contentId) => {
    set({ isLoading: true, error: null })
    try {
      await contentAPI.deleteContent(contentId)
      // 刷新列表
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 获取内容类型
  fetchContentTypes: async () => {
    try {
      const response = await contentAPI.getContentTypes()
      set({ contentTypes: response })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  // 获取分类
  fetchCategories: async () => {
    try {
      const response = await contentAPI.getCategories()
      set({ categories: response })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  // 搜索内容
  searchContents: async (query) => {
    set({ isLoading: true, error: null, searchQuery: query })
    try {
      const { contentTypeFilter, categoryFilter, difficultyFilter, page, size } = get()
      const response = await contentAPI.searchContents({
        query,
        content_type: contentTypeFilter,
        category: categoryFilter,
        difficulty: difficultyFilter,
        page,
        size,
      })
      set({
        contents: response.contents,
        total: response.total,
        page: response.page,
        size: response.size,
        pages: response.pages,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 设置过滤条件
  setFilters: (filters) => {
    set({
      contentTypeFilter: filters.contentType !== undefined ? filters.contentType : get().contentTypeFilter,
      categoryFilter: filters.category !== undefined ? filters.category : get().categoryFilter,
      difficultyFilter: filters.difficulty !== undefined ? filters.difficulty : get().difficultyFilter,
    })
    // 重新获取数据
    get().fetchContents()
  },
  
  // 设置页码
  setPage: (page) => {
    set({ page })
    get().fetchContents()
  },
  
  // 重置过滤条件
  resetFilters: () => {
    set({
      contentTypeFilter: null,
      categoryFilter: null,
      difficultyFilter: null,
      searchQuery: '',
      page: 1,
    })
    get().fetchContents()
  },
}))