import { useState, useEffect } from 'react'
import { useContentStore } from '@/stores/contentStore'
import type { Content } from '@/lib/supabase'

interface UseSkillPracticeOptions {
  contentType: string
}

export function useSkillPractice({ contentType }: UseSkillPracticeOptions) {
  const { contents, fetchContents } = useContentStore()
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  useEffect(() => {
    fetchContents({ content_type: contentType })
  }, [contentType, fetchContents])

  const handleSelectContent = (content: Content) => {
    setSelectedContent(content)
  }

  const handleBack = () => {
    setSelectedContent(null)
  }

  return {
    contents,
    selectedContent,
    setSelectedContent,
    handleSelectContent,
    handleBack,
  }
}
