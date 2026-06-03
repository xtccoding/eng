import { create } from 'zustand'
import { supabase, type Content } from '@/lib/supabase'

interface ContentState {
  contents: Content[]
  currentContent: Content | null
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
  fetchContent: (contentId: string) => Promise<void>
  createContent: (data: Partial<Content>) => Promise<void>
  updateContent: (contentId: string, data: Partial<Content>) => Promise<void>
  deleteContent: (contentId: string) => Promise<void>
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
      const currentPage = params?.page || page
      const pageSize = params?.size || size
      const offset = (currentPage - 1) * pageSize

      let query = supabase
        .from('contents')
        .select('*', { count: 'exact' })

      const type = params?.content_type || contentTypeFilter
      if (type) query = query.eq('content_type', type)

      const cat = params?.category || categoryFilter
      if (cat) query = query.eq('category', cat)

      const diff = params?.difficulty || difficultyFilter
      if (diff) query = query.eq('difficulty', diff)

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1)

      const { data, error, count } = await query

      if (error) throw error

      set({
        contents: data || [],
        total: count || 0,
        page: currentPage,
        size: pageSize,
        pages: Math.ceil((count || 0) / pageSize),
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchContent: async (contentId) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('id', contentId)
        .single()

      if (error) throw error
      set({ currentContent: data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  createContent: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.from('contents').insert(data)
      if (error) throw error
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  updateContent: async (contentId, data) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('contents')
        .update(data)
        .eq('id', contentId)

      if (error) throw error
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  deleteContent: async (contentId) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', contentId)

      if (error) throw error
      get().fetchContents()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchContentTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('content_type')

      if (error) throw error
      const types = [...new Set((data || []).map((r: any) => r.content_type))]
      set({ contentTypes: types })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('category')

      if (error) throw error
      const cats = [...new Set((data || []).map((r: any) => r.category))]
      set({ categories: cats })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  searchContents: async (query) => {
    set({ isLoading: true, error: null, searchQuery: query })
    try {
      const { contentTypeFilter, categoryFilter, difficultyFilter, page, size } = get()
      const offset = (page - 1) * size

      let q = supabase
        .from('contents')
        .select('*', { count: 'exact' })
        .or(`title.ilike.%${query}%,content_text.ilike.%${query}%`)

      if (contentTypeFilter) q = q.eq('content_type', contentTypeFilter)
      if (categoryFilter) q = q.eq('category', categoryFilter)
      if (difficultyFilter) q = q.eq('difficulty', difficultyFilter)

      q = q.order('created_at', { ascending: false }).range(offset, offset + size - 1)

      const { data, error, count } = await q

      if (error) throw error

      set({
        contents: data || [],
        total: count || 0,
        pages: Math.ceil((count || 0) / size),
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
