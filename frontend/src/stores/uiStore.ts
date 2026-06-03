import { create } from 'zustand'

interface UIState {
  // 主题
  theme: 'light' | 'dark' | 'system'
  
  // 侧边栏
  sidebarOpen: boolean
  
  // 模态框
  modalOpen: boolean
  modalContent: any | null
  
  // 通知
  notifications: any[]
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (content: any) => void
  closeModal: () => void
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  // 初始状态
  theme: 'system',
  sidebarOpen: true,
  modalOpen: false,
  modalContent: null,
  notifications: [],
  
  // 设置主题
  setTheme: (theme) => {
    set({ theme })
    // 应用主题到DOM
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    
    // 保存到本地存储
    localStorage.setItem('theme', theme)
  },
  
  // 切换侧边栏
  toggleSidebar: () => {
    set({ sidebarOpen: !get().sidebarOpen })
  },
  
  // 设置侧边栏状态
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },
  
  // 打开模态框
  openModal: (content) => {
    set({ modalOpen: true, modalContent: content })
  },
  
  // 关闭模态框
  closeModal: () => {
    set({ modalOpen: false, modalContent: null })
  },
  
  // 添加通知
  addNotification: (notification) => {
    const id = Date.now().toString()
    set({
      notifications: [...get().notifications, { ...notification, id }],
    })
    
    // 自动移除通知
    setTimeout(() => {
      get().removeNotification(id)
    }, 5000)
  },
  
  // 移除通知
  removeNotification: (id) => {
    set({
      notifications: get().notifications.filter((n) => n.id !== id),
    })
  },
}))