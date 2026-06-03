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

### Recommended Architecture

#### Option A: Browser-First (Free, No Backend)
```
TTS: Browser SpeechSynthesis API
Recording: Browser MediaRecorder API → save as blob
STT: Browser Web Speech API (SpeechRecognition)
Scoring: Levenshtein distance between expected vs recognized text
Storage: Not needed (everything in-browser)
```
Pros: Free, no backend, works offline
Cons: STT accuracy varies by browser, no pronunciation scoring

#### Option B: Hybrid (Best Quality/Cost Balance) - RECOMMENDED
```
TTS: Generate audio with OpenAI TTS API or ElevenLabs
Storage: Upload generated MP3 to Cloudflare R2 (public bucket)
Playback: <audio> tag with R2 public URL
Recording: Browser MediaRecorder API
STT: OpenAI Whisper API (upload recorded blob)
Scoring: Whisper transcript vs expected text + confidence score
```
Pros: High quality TTS, accurate STT, professional pronunciation eval
Cons: API costs (~$0.006/1K chars for OpenAI TTS, $0.006/min for Whisper)

#### Option C: Azure Speech Services (Enterprise)
```
TTS: Azure Neural TTS (many voices)
STT: Azure Speech SDK with pronunciation assessment
Scoring: Azure built-in pronunciation scoring (phoneme-level)
Storage: Azure Blob or Cloudflare R2
```
Pros: Best pronunciation scoring, phoneme-level feedback
Cons: More expensive, more complex integration

### Implementation Plan (Option B)

1. **Audio Generation Script** (run once):
   - For each content in `contents` table
   - Call OpenAI TTS API to generate MP3
   - Upload to Cloudflare R2 at `audio/{content_id}.mp3`
   - Update `contents.audio_url` with R2 public URL

2. **Frontend Playback**:
   - Listening page: use `<audio src={content.audio_url}>` for playback
   - Add play/pause/seek controls
   - Auto-highlight current sentence during playback

3. **Recording & Evaluation**:
   - Use MediaRecorder to capture user speech
   - Upload blob to Supabase Edge Function (proxy to OpenAI Whisper)
   - Compare transcript with expected text
   - Calculate accuracy score (word-level and character-level)
   - Display feedback with highlighted errors

4. **Supabase Edge Function for Audio Proxy**:
   ```
   POST /functions/audio-proxy
   - Receives audio blob
   - Forwards to OpenAI Whisper API
   - Returns transcript + confidence
   ```
   This avoids exposing API keys in frontend.

5. **R2 CORS Configuration**:
   - Allow origin: your Cloudflare Pages domain
   - Allow methods: GET
   - Cache-Control: public, max-age=31536000 (immutable for generated audio)

### Cost Estimate (Option B)
- 20 contents × ~500 chars average = 10K chars TTS = ~$0.06
- User recordings: ~1 min/day = $0.006/day per user
- R2 storage: 20 MP3s × ~100KB = 2MB = negligible
- R2 bandwidth: negligible for small user base
