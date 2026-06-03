import { create } from 'zustand'
import { exportAPI } from '@/services/api'

interface ExportState {
  // 导出记录
  exportRecords: any[]
  
  // 加载状态
  isLoading: boolean
  error: string | null
  
  // Actions
  exportData: (data: {
    export_type: string
    include_presets?: boolean
    format?: string
  }) => Promise<void>
  importData: (file: File) => Promise<void>
  downloadExport: (fileName: string) => Promise<void>
  fetchExportRecords: () => Promise<void>
  createBackup: () => Promise<void>
}

export const useExportStore = create<ExportState>((set, get) => ({
  // 初始状态
  exportRecords: [],
  isLoading: false,
  error: null,
  
  // 导出数据
  exportData: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await exportAPI.exportData(data)
      // 自动下载文件
      await get().downloadExport(response.file_name)
      // 刷新记录
      get().fetchExportRecords()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 导入数据
  importData: async (file) => {
    set({ isLoading: true, error: null })
    try {
      await exportAPI.importData(file)
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 下载导出文件
  downloadExport: async (fileName) => {
    try {
      const response = await exportAPI.downloadExport(fileName)
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  // 获取导出记录
  fetchExportRecords: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await exportAPI.getExportRecords()
      set({ exportRecords: response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // 创建备份
  createBackup: async () => {
    set({ isLoading: true, error: null })
    try {
      await exportAPI.createBackup()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
}))