import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  level: number
  experience: number
  total_sessions: number
  current_streak: number
  created_at: string
}

export interface TypingSession {
  id: string
  user_id: string
  content_id: string | null
  wpm: number
  accuracy: number
  duration: number
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
  body: string
  difficulty: string
  category: string
  created_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement_type: string
  requirement_value: number
  experience_reward: number
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
  correct_count: number
  wrong_count: number
  last_practiced: string
}
