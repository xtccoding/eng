import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库类型定义
export interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  level: number
  experience: number
  total_practice_time: number
  total_sessions: number
  current_streak: number
  longest_streak: number
  last_practice_date?: string
  created_at: string
  updated_at: string
}

export interface TypingSession {
  id: string
  user_id: string
  content_id: string
  content_type: string
  start_time: string
  end_time?: string
  duration: number
  total_chars: number
  correct_chars: number
  wpm: number
  accuracy: number
  max_combo: number
  is_completed: boolean
  created_at: string
}

export interface TypingResult {
  id: string
  session_id: string
  char_index: number
  expected_char: string
  typed_char: string
  is_correct: boolean
  time_taken: number
  created_at: string
}

export interface Content {
  id: string
  title: string
  content_type: string
  category: string
  difficulty: string
  content_text: string
  translation?: string
  audio_url?: string
  tags?: string[]
  source?: string
  is_preset: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  requirement_type: string
  requirement_value: number
  experience_reward: number
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
}

export interface WordProgress {
  id: string
  user_id: string
  word: string
  translation: string
  content_id: string
  practice_count: number
  correct_count: number
  accuracy: number
  mastery_level: number
  last_practice_date?: string
  created_at: string
  updated_at: string
}
