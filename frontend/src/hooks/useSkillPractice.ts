import { useState, useEffect } from 'react'
import { useContentStore } from '@/stores/contentStore'
import type { ContentItem } from '@/types/content'

interface UseSkillPracticeOptions {
  contentType: string
}

export function useSkillPractice({ contentType }: UseSkillPracticeOptions) {
  const { contents, fetchContents } = useContentStore()
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)

  useEffect(() => {
    fetchContents({ content_type: contentType })
  }, [contentType, fetchContents])

  const handleSelectContent = (content: ContentItem) => {
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
