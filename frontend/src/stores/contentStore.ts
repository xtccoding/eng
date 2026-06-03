import { create } from 'zustand'
import { contentAPI } from '@/services/api'

interface ContentState {
  contents: any[]
  currentContent: any | null
  contentTypes: string[]
  categories: string[]
  page: number
  size: number
  total: number
  pages: number
  contentTypeFilter: string | undefined
  categoryFilter: string | undefined
  difficultyFilter: string | undefined
  searchQuery: string
  isLoading: boolean
  error: string | null
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
  contents: [],
  currentContent: null,
  contentTypes: [],
  categories: [],
  page: 1,
  size: 20,
  total: 0,
  pages: 0,
  contentTypeFilter: undefined,
  categoryFilter: undefined,
  difficultyFilter: undefined,
  searchQuery: '',
  isLoading: false,
  error: null,
  
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
      
      const response: any = await contentAPI.getContents(queryParams)
      set({
        contents: response.contents || [],
        total: response.total || 0,
        page: response.page || 1,
        size: response.size || 20,
        pages: response.pages || 0,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  fetchContent: async (contentId) => {
    set({ isLoading: true, error: null })
    try {
      const response: any = await contentAPI.getContent(contentId)
      set({ currentContent: response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  createContent: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await contentAPI.createContent(data)
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  updateContent: async (contentId, data) => {
    set({ isLoading: true, error: null })
    try {
      await contentAPI.updateContent(contentId, data)
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  deleteContent: async (contentId) => {
    set({ isLoading: true, error: null })
    try {
      await contentAPI.deleteContent(contentId)
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  fetchContentTypes: async () => {
    try {
      const response: any = await contentAPI.getContentTypes()
      set({ contentTypes: Array.isArray(response) ? response : [] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  fetchCategories: async () => {
    try {
      const response: any = await contentAPI.getCategories()
      set({ categories: Array.isArray(response) ? response : [] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  searchContents: async (query) => {
    set({ isLoading: true, error: null, searchQuery: query })
    try {
      const { contentTypeFilter, categoryFilter, difficultyFilter, page, size } = get()
      const response: any = await contentAPI.searchContents({
        query,
        content_type: contentTypeFilter,
        category: categoryFilter,
        difficulty: difficultyFilter,
        page,
        size,
      })
      set({
        contents: response.contents || [],
        total: response.total || 0,
        page: response.page || 1,
        size: response.size || 20,
        pages: response.pages || 0,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  setFilters: (filters) => {
    set({
      contentTypeFilter: filters.contentType !== undefined ? (filters.contentType || undefined) : get().contentTypeFilter,
      categoryFilter: filters.category !== undefined ? (filters.category || undefined) : get().categoryFilter,
      difficultyFilter: filters.difficulty !== undefined ? (filters.difficulty || undefined) : get().difficultyFilter,
    })
    get().fetchContents()
  },
  
  setPage: (page) => {
    set({ page })
    get().fetchContents()
  },
  
  resetFilters: () => {
    set({
      contentTypeFilter: undefined,
      categoryFilter: undefined,
      difficultyFilter: undefined,
      searchQuery: '',
      page: 1,
    })
    get().fetchContents()
  },
}))