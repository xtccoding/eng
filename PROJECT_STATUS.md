# Xtcer-Eng Project Status & Roadmap

## Architecture Overview

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- **Auth**: Supabase Auth (email/password)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Cloudflare Pages (frontend), Supabase (backend/auth/data)
- **Old Backend**: FastAPI + SQLite (DEPRECATED - being migrated away)

## Data Layer Status

| Layer | Status | Used By |
|---|---|---|
| Supabase (direct) | ACTIVE | contentStore, useAuth, useSupabase.ts (typing, achievements, word progress) |
| Axios API (FastAPI) | DEPRECATED | typingStore, progressStore, exportStore, Achievements, Generation, Leaderboard |

**MIGRATION IN PROGRESS**: contentStore and auth already migrated to Supabase. typingStore, progressStore, exportStore still reference the old axios API and need migration.

---

## Pages & Features Status

### FULLY WORKING (Supabase-backed)

| Page | Route | Status | Notes |
|---|---|---|---|
| Auth (Login/Register) | `/auth` | DONE | Supabase Auth, skip-login works |
| Home | `/` | DONE | Skill cards, stat cards, quick start CTA |
| Skills | `/skills` | DONE | Tab filters, content grid, difficulty badges |
| Listening | `/listening` | DONE | Content list → detail with TypingArea |
| Speaking | `/speaking` | DONE | Sentence-by-sentence practice, mic buttons (simulated) |
| Reading | `/reading` | DONE | Article view + translation + TypingArea |
| Writing | `/writing` | DONE | Writing tips + TypingArea |
| Vocabulary | `/vocabulary` | DONE | Word list, flashcard view, prev/next navigation |
| TypingPractice | `/practice` | DONE | 4-tab content selector, TypingArea, StatsPanel |

### BROKEN (Still uses old axios API - needs Supabase migration)

| Page | Route | Issue |
|---|---|---|
| ProgressDashboard | `/progress` | Uses progressStore (axios). Needs Supabase migration for typing_sessions, achievements, word_progress |
| Achievements | `/achievements` | Uses progressAPI.getAchievements (axios). Needs Supabase migration |
| Leaderboard | `/leaderboard` | Uses progressAPI.getLeaderboard (axios). Needs Supabase migration |
| Generation | `/generation` | Uses generationAPI (axios). Needs AI generation integration |
| Settings | `/settings` | Export/Import uses exportStore (axios). Theme/audio settings work client-side |
| ContentLibrary | `/content` | Uses contentStore (Supabase - works), but Add Content button and View Details are non-functional |

### PLACEHOLDER / INCOMPLETE

| Page | Route | Issue |
|---|---|---|
| Pronunciation | `/pronunciation` | 5 hardcoded words, recording is FAKE (always "correct"), no real STT evaluation |

---

## Database Tables (Supabase)

### Created & Populated
- `contents` - 20 seed records (listening x3, speaking x3, reading x3, writing x3, vocabulary x3, speech x2, ielts x1, article x2)

### Referenced in Code (need creation)
- `profiles` - user profiles (level, experience, streak)
- `typing_sessions` - typing practice sessions
- `typing_results` - per-character typing results
- `achievements` - achievement definitions
- `user_achievements` - user unlock records
- `word_progress` - vocabulary mastery tracking

---

## Components Inventory

### Common (components/common/)
| Component | File | Status |
|---|---|---|
| PageHeader | PageHeader.tsx | DONE |
| EmptyState | EmptyState.tsx | DONE |
| DifficultyBadge | DifficultyBadge.tsx | DONE |
| StatCard | StatCard.tsx | DONE |
| GradientCard | GradientCard.tsx | DONE |
| DetailHeader | DetailHeader.tsx | DONE |
| ContentCard | ContentCard.tsx | DONE |
| Header | Header.tsx | DONE |
| Sidebar | Sidebar.tsx | DONE |
| Footer | Footer.tsx | DONE |
| Loading | Loading.tsx | DONE |

### Typing (components/typing/)
| Component | File | Status |
|---|---|---|
| TypingArea | TypingArea.tsx | DONE - core typing engine, WPM/accuracy tracking, combo system, Supabase session recording |
| StatsPanel | StatsPanel.tsx | DONE - WPM/accuracy/chars display |

### Content (components/content/)
| Component | File | Status |
|---|---|---|
| ContentSelector | ContentSelector.tsx | DONE - content list with cards |

### UI (components/ui/)
| Component | File | Status |
|---|---|---|
| badge | badge.tsx | DONE |
| button | button.tsx | DONE |
| card | card.tsx | DONE |
| input | input.tsx | DONE |
| mode-toggle | mode-toggle.tsx | DONE |
| progress | progress.tsx | DONE |
| tabs | tabs.tsx | DONE |

---

## Hooks

| Hook | File | Status |
|---|---|---|
| useAuth | useAuth.tsx | DONE - Supabase auth, profile management |
| useSkillPractice | useSkillPractice.ts | DONE - shared logic for 5 skill pages |
| useSupabase | useSupabase.ts | MOSTLY DONE - typing/content/achievements/word_progress, but wpm/accuracy achievement checks are stubs |

---

## Stores (Zustand)

| Store | File | Data Layer | Status |
|---|---|---|---|
| contentStore | contentStore.ts | Supabase | DONE |
| typingStore | typingStore.ts | Axios (DEPRECATED) | DONE but needs Supabase migration |
| progressStore | progressStore.ts | Axios (DEPRECATED) | DONE but needs Supabase migration |
| uiStore | uiStore.ts | Client-only | DONE |
| exportStore | exportStore.ts | Axios (DEPRECATED) | DONE but needs Supabase migration |

---

## CSS System

Custom iOS-style design system in `globals.css` (wrapped in `@layer components`):
- `.ios-card`, `.ios-button`, `.ios-button-secondary`, `.ios-input`
- `.ios-title`, `.ios-subtitle`, `.ios-body`, `.ios-caption`
- `.ios-badge`, `.ios-progress`, `.ios-nav`, `.ios-sidebar`
- `.glass`, `.glass-card` (frosted glass effects)
- `.typing-correct`, `.typing-incorrect`, `.typing-current`
- `.animate-ios-fade-in`, `.animate-ios-scale-in`, `.animate-ios-slide-up`

---

## NEXT STEPS (Priority Order)

### P1 - Fix Broken Pages
1. Create remaining Supabase tables (profiles, typing_sessions, typing_results, achievements, user_achievements, word_progress)
2. Migrate typingStore to Supabase (or use useSupabase.ts hooks everywhere)
3. Migrate progressStore to Supabase
4. Seed achievements data

### P2 - Audio/Speech Integration
See audio plan below.

### P3 - Polish
- ContentLibrary: wire Add Content and View Details buttons
- Pronunciation: real recording + evaluation
- Generation: integrate with OpenAI/other AI API
- Leaderboard: deduplicate 3 tab panels into 1 component
- Remove unused axios API code after full Supabase migration

---

## AUDIO/SPEECH INTEGRATION PLAN

### Current State
- Browser SpeechSynthesis used in Pronunciation.tsx (basic TTS)
- Recording is FAKE (setTimeout simulation)
- No audio files stored anywhere

### Architecture: MiniMax TTS + Cloudflare R2

```
User clicks play
  → Frontend calls Supabase Edge Function /tts
  → Edge Function calls MiniMax T2A V2 API (speech-2.8-turbo)
  → Returns MP3 audio (hex encoded)
  → Edge Function decodes hex → binary → returns to frontend
  → Frontend plays via <audio> tag
  → (Optional) Upload to R2 for permanent cache
```

### Components

1. **Supabase Edge Function**: `supabase/functions/tts/index.ts`
   - Proxies MiniMax API (hides API key)
   - Supports voice selection, speed control
   - Returns MP3 binary with CORS headers
   - Caches 24h via Cache-Control

2. **Frontend Hook**: `hooks/useTTS.ts`
   - `speak(text)` / `stop()` / `isPlaying` / `isLoading`
   - Client-side cache (Map) for repeated phrases
   - Voice presets: female-elegant, female-young, male-mature, etc.

3. **MiniMax API Config**:
   - Endpoint: `https://api.minimaxi.com/v1/t2a_v2`
   - Model: `speech-2.8-turbo` (fast, good quality)
   - English voices: `English_Graceful_Lady`, `English_radiant_girl`, `English_Insightful_Speaker`, `English_Persuasive_Man`
   - Language boost: `English`

### Setup Steps

1. Get MiniMax API key from https://platform.minimaxi.com/user-center/basic-information/interface-key
2. Set secret: `supabase secrets set MINIMAX_API_KEY=your_key_here`
3. Deploy function: `supabase functions deploy tts`
4. Add `.env` variable: `VITE_SUPABASE_URL` (already set)

### R2 Permanent Storage (Optional)

For frequently used content (seed data), pre-generate audio and store in R2:
1. Script calls MiniMax API for each content
2. Uploads MP3 to R2 at `audio/{content_id}.mp3`
3. Updates `contents.audio_url` with R2 public URL
4. Frontend checks `audio_url` first, falls back to live TTS

### Cost
- MiniMax TTS: Check current pricing at https://platform.minimaxi.com/docs/guides/pricing-paygo.md
- Supabase Edge Functions: Free tier includes 500K invocations/month
- Cloudflare R2: 10GB free storage, 1M free reads/month
