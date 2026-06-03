import { create } from 'zustand'
import { exportAPI } from '@/services/api'

interface ExportState {
  exportRecords: any[]
  isLoading: boolean
  error: string | null
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
  exportRecords: [],
  isLoading: false,
  error: null,
  
  exportData: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response: any = await exportAPI.exportData(data)
      if (response?.file_name) {
        await get().downloadExport(response.file_name)
      }
      get().fetchExportRecords()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  importData: async (file) => {
    set({ isLoading: true, error: null })
    try {
      await exportAPI.importData(file)
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  downloadExport: async (fileName) => {
    try {
      const response: any = await exportAPI.downloadExport(fileName)
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
  
  fetchExportRecords: async () => {
    set({ isLoading: true, error: null })
    try {
      const response: any = await exportAPI.getExportRecords()
      set({ exportRecords: Array.isArray(response) ? response : [], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  
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