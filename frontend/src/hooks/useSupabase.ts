import { useState, useEffect, useCallback } from 'react'
import { supabase, TypingSession, TypingResult, Content, Achievement, UserAchievement, WordProgress } from '@/lib/supabase'
import { useAuth } from './useAuth'

// 打字练习钩子
export function useTyping() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<TypingSession[]>([])
  const [loading, setLoading] = useState(false)

  // 创建练习会话
  const createSession = async (contentId: string, contentType: string) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('typing_sessions')
        .insert({
          user_id: user.id,
          content_id: contentId,
          content_type: contentType,
          start_time: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating session:', error)
      return null
    }
  }

  // 提交打字结果
  const submitResult = async (sessionId: string, result: Omit<TypingResult, 'id' | 'session_id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('typing_results')
        .insert({
          session_id: sessionId,
          ...result,
        })

      if (error) throw error
    } catch (error) {
      console.error('Error submitting result:', error)
    }
  }

  // 完成练习会话
  const completeSession = async (sessionId: string, stats: {
    duration: number
    total_chars: number
    correct_chars: number
    wpm: number
    accuracy: number
    max_combo: number
  }) => {
    try {
      const { error } = await supabase
        .from('typing_sessions')
        .update({
          end_time: new Date().toISOString(),
          ...stats,
          is_completed: true,
        })
        .eq('id', sessionId)

      if (error) throw error

      // 更新用户统计
      if (user) {
        await updateUserStats(stats)
      }
    } catch (error) {
      console.error('Error completing session:', error)
    }
  }

  // 更新用户统计
  const updateUserStats = async (stats: { duration: number; wpm: number; accuracy: number }) => {
    if (!user) return

    try {
      // 获取当前 profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) return

      // 计算新的统计
      const newTotalSessions = profile.total_sessions + 1
      const newTotalPracticeTime = profile.total_practice_time + stats.duration
      const newExperience = profile.experience + Math.round(stats.wpm * stats.accuracy / 100)
      const newLevel = Math.floor(newExperience / 1000) + 1

      // 更新 streak
      const lastPractice = profile.last_practice_date ? new Date(profile.last_practice_date) : null
      const today = new Date()
      const isConsecutive = lastPractice && 
        (today.getTime() - lastPractice.getTime()) < 48 * 60 * 60 * 1000

      const newStreak = isConsecutive ? profile.current_streak + 1 : 1
      const newLongestStreak = Math.max(profile.longest_streak, newStreak)

      await supabase
        .from('profiles')
        .update({
          total_sessions: newTotalSessions,
          total_practice_time: newTotalPracticeTime,
          experience: newExperience,
          level: newLevel,
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_practice_date: today.toISOString(),
          updated_at: today.toISOString(),
        })
        .eq('id', user.id)
    } catch (error) {
      console.error('Error updating user stats:', error)
    }
  }

  // 获取用户练习历史
  const fetchSessions = async (limit = 20) => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('typing_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    sessions,
    loading,
    createSession,
    submitResult,
    completeSession,
    fetchSessions,
  }
}

// 内容钩子
export function useContents() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)

  const fetchContents = async (contentType?: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('contents')
        .select('*')
        .order('created_at', { ascending: false })

      if (contentType) {
        query = query.eq('content_type', contentType)
      }

      const { data, error } = await query

      if (error) throw error
      setContents(data || [])
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getContent = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching content:', error)
      return null
    }
  }

  return {
    contents,
    loading,
    fetchContents,
    getContent,
  }
}

// 成就钩子
export function useAchievements() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAchievements = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true })

      if (error) throw error
      setAchievements(data || [])
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAchievements = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setUserAchievements(data || [])
    } catch (error) {
      console.error('Error fetching user achievements:', error)
    }
  }

  const checkAndUnlockAchievements = async () => {
    if (!user) return

    try {
      // 获取用户统计
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) return

      // 检查每个成就
      for (const achievement of achievements) {
        const isUnlocked = userAchievements.some(ua => ua.achievement_id === achievement.id)
        if (isUnlocked) continue

        let shouldUnlock = false

        switch (achievement.requirement_type) {
          case 'sessions':
            shouldUnlock = profile.total_sessions >= achievement.requirement_value
            break
          case 'streak':
            shouldUnlock = profile.current_streak >= achievement.requirement_value
            break
          case 'wpm':
            // 需要从最近的会话中检查
            break
          case 'accuracy':
            // 需要从最近的会话中检查
            break
        }

        if (shouldUnlock) {
          await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_id: achievement.id,
            })

          // 增加经验值
          await supabase
            .from('profiles')
            .update({
              experience: profile.experience + achievement.experience_reward,
            })
            .eq('id', user.id)
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  return {
    achievements,
    userAchievements,
    loading,
    fetchAchievements,
    fetchUserAchievements,
    checkAndUnlockAchievements,
  }
}

// 单词进度钩子
export function useWordProgress() {
  const { user } = useAuth()
  const [words, setWords] = useState<WordProgress[]>([])
  const [loading, setLoading] = useState(false)

  const fetchWords = async (contentId?: string) => {
    if (!user) return

    setLoading(true)
    try {
      let query = supabase
        .from('word_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (contentId) {
        query = query.eq('content_id', contentId)
      }

      const { data, error } = await query

      if (error) throw error
      setWords(data || [])
    } catch (error) {
      console.error('Error fetching words:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateWordProgress = async (word: string, translation: string, contentId: string, isCorrect: boolean) => {
    if (!user) return

    try {
      // 查找现有记录
      const { data: existing } = await supabase
        .from('word_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('word', word)
        .single()

      if (existing) {
        // 更新现有记录
        const newPracticeCount = existing.practice_count + 1
        const newCorrectCount = isCorrect ? existing.correct_count + 1 : existing.correct_count
        const newAccuracy = (newCorrectCount / newPracticeCount) * 100
        const newMasteryLevel = Math.min(5, Math.floor(newPracticeCount / 5))

        await supabase
          .from('word_progress')
          .update({
            practice_count: newPracticeCount,
            correct_count: newCorrectCount,
            accuracy: newAccuracy,
            mastery_level: newMasteryLevel,
            last_practice_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      } else {
        // 创建新记录
        await supabase
          .from('word_progress')
          .insert({
            user_id: user.id,
            word,
            translation,
            content_id: contentId,
            practice_count: 1,
            correct_count: isCorrect ? 1 : 0,
            accuracy: isCorrect ? 100 : 0,
            mastery_level: 0,
            last_practice_date: new Date().toISOString(),
          })
      }
    } catch (error) {
      console.error('Error updating word progress:', error)
    }
  }

  return {
    words,
    loading,
    fetchWords,
    updateWordProgress,
  }
}