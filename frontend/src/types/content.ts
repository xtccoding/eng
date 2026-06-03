export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type ContentType = 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary' | 'speech' | 'ielts' | 'article'

export interface ContentItem {
  id: number
  title: string
  content_text: string
  content_type: string
  category?: string
  difficulty: DifficultyLevel
  translation?: string
  description?: string
  created_at?: string
  updated_at?: string
}
