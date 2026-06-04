import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface UseTTSOptions {
  voice?: string
  speed?: number
}

export function useTTS({ voice = 'female-elegant', speed = 1.0 }: UseTTSOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cacheRef = useRef<Map<string, string>>(new Map())

  const speak = useCallback(async (text: string) => {
    if (!text) return

    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // Check cache
    const cacheKey = `${voice}:${speed}:${text}`
    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      playAudio(cached)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('tts', {
        body: { text, voice, speed, format: 'mp3' },
      })

      if (fnError) throw new Error(fnError.message)

      // data is the response body (audio blob as ArrayBuffer)
      // supabase.functions.invoke returns the raw response for non-JSON
      let audioUrl: string

      if (data instanceof ArrayBuffer || data instanceof Blob) {
        const blob = data instanceof Blob ? data : new Blob([data], { type: 'audio/mp3' })
        audioUrl = URL.createObjectURL(blob)
      } else if (typeof data === 'string') {
        // Might be hex encoded fallback
        audioUrl = data
      } else {
        throw new Error('Unexpected response format')
      }

      // Cache it
      cacheRef.current.set(cacheKey, audioUrl)

      playAudio(audioUrl)
    } catch (err: any) {
      console.error('TTS error:', err)
      setError(err.message || '语音合成失败')
    } finally {
      setIsLoading(false)
    }
  }, [voice, speed])

  const playAudio = (url: string) => {
    const audio = new Audio(url)
    audioRef.current = audio

    audio.onplay = () => setIsPlaying(true)
    audio.onended = () => {
      setIsPlaying(false)
      audioRef.current = null
    }
    audio.onerror = () => {
      setIsPlaying(false)
      setError('音频播放失败')
      audioRef.current = null
    }

    audio.play().catch((err) => {
      console.error('Audio play failed:', err)
      setError('音频播放失败')
      setIsPlaying(false)
    })
  }

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
      setIsPlaying(false)
    }
  }, [])

  return { speak, stop, isPlaying, isLoading, error }
}
