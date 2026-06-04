// supabase/functions/tts/index.ts
// MiniMax TTS Proxy via Supabase Edge Function
// Deploy: supabase functions deploy tts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY')!
const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/t2a_v2'

// Voice presets for English learning
const VOICE_MAP: Record<string, string> = {
  'female-elegant': 'English_Graceful_Lady',
  'female-young': 'English_radiant_girl',
  'male-mature': 'English_Insightful_Speaker',
  'male-persuasive': 'English_Persuasive_Man',
  'robot': 'English_Lucky_Robot',
}

serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    const { text, voice = 'female-elegant', speed = 1.0, format = 'mp3' } = await req.json()

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Truncate if too long (MiniMax limit: 10000 chars)
    const truncatedText = text.length > 5000 ? text.substring(0, 5000) : text

    const voiceId = VOICE_MAP[voice] || voice // Allow custom voice_id too

    const payload = {
      model: 'speech-2.8-turbo', // Faster, still good quality
      text: truncatedText,
      stream: false,
      voice_setting: {
        voice_id: voiceId,
        speed: Math.max(0.5, Math.min(2, speed)),
        vol: 1,
        pitch: 0,
      },
      audio_setting: {
        sample_rate: 24000,
        bitrate: 128000,
        format: format,
        channel: 1,
      },
      language_boost: 'English',
      output_format: 'hex', // Return hex encoded audio
    }

    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('MiniMax API error:', errText)
      return new Response(JSON.stringify({ error: 'TTS API failed', detail: errText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = await response.json()

    if (result.base_resp?.status_code !== 0) {
      return new Response(JSON.stringify({
        error: 'TTS generation failed',
        detail: result.base_resp?.status_msg,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Decode hex audio to binary
    const hexAudio = result.data?.audio
    if (!hexAudio) {
      return new Response(JSON.stringify({ error: 'No audio data returned' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Convert hex to Uint8Array
    const hexPairs = hexAudio.match(/.{1,2}/g) || []
    const bytes = new Uint8Array(hexPairs.map((b: string) => parseInt(b, 16)))

    return new Response(bytes, {
      headers: {
        'Content-Type': `audio/${format}`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400', // Cache 24h
        'X-Audio-Duration': String(result.extra_info?.audio_length || 0),
        'X-Audio-Size': String(result.extra_info?.audio_size || 0),
      },
    })
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(JSON.stringify({ error: 'Internal error', detail: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
