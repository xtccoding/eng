-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT DEFAULT '',
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  total_practice_time FLOAT DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_practice_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学习内容表
CREATE TABLE IF NOT EXISTS contents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- listening, speaking, reading, writing, vocabulary
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium', -- easy, medium, hard
  content_text TEXT NOT NULL,
  translation TEXT,
  audio_url TEXT,
  tags TEXT[],
  source TEXT,
  is_preset BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 打字练习会话表
CREATE TABLE IF NOT EXISTS typing_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration FLOAT DEFAULT 0,
  total_chars INTEGER DEFAULT 0,
  correct_chars INTEGER DEFAULT 0,
  wpm FLOAT DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  max_combo INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 打字结果详情表
CREATE TABLE IF NOT EXISTS typing_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES typing_sessions(id) ON DELETE CASCADE NOT NULL,
  char_index INTEGER NOT NULL,
  expected_char TEXT NOT NULL,
  typed_char TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 成就表
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '🏆',
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  experience_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 单词进度表
CREATE TABLE IF NOT EXISTS word_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  translation TEXT DEFAULT '',
  content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
  practice_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  mastery_level INTEGER DEFAULT 0,
  last_practice_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_typing_sessions_user_id ON typing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_sessions_created_at ON typing_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_typing_results_session_id ON typing_results(session_id);
CREATE INDEX IF NOT EXISTS idx_contents_content_type ON contents(content_type);
CREATE INDEX IF NOT EXISTS idx_word_progress_user_id ON word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- 启用 Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON typing_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON typing_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON typing_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own results" ON typing_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM typing_sessions
      WHERE typing_sessions.id = typing_results.session_id
      AND typing_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own results" ON typing_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM typing_sessions
      WHERE typing_sessions.id = typing_results.session_id
      AND typing_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own word progress" ON word_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own word progress" ON word_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own word progress" ON word_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- 内容表：所有人可读，只有管理员可写
CREATE POLICY "Anyone can view contents" ON contents
  FOR SELECT USING (true);

-- 成就表：所有人可读
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- 创建新用户时自动创建 profile 的函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 触发器：新用户注册时创建 profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 插入预置成就
INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, experience_reward) VALUES
  ('初次练习', '完成第一次打字练习', '🎯', 'beginner', 'sessions', 1, 10),
  ('坚持不懈', '连续练习3天', '🔥', 'streak', 'streak', 3, 50),
  ('一周达人', '连续练习7天', '⭐', 'streak', 'streak', 7, 100),
  ('打字新手', '累计练习10次', '📝', 'practice', 'sessions', 10, 50),
  ('打字高手', '累计练习50次', '🏆', 'practice', 'sessions', 50, 200),
  ('速度之星', '达到50 WPM', '⚡', 'speed', 'wpm', 50, 100),
  ('速度之王', '达到100 WPM', '🚀', 'speed', 'wpm', 100, 300),
  ('完美准确', '准确率达到100%', '💎', 'accuracy', 'accuracy', 100, 150),
  ('词汇大师', '掌握100个单词', '📚', 'vocabulary', 'words', 100, 200),
  ('听力达人', '完成20次听力练习', '🎧', 'listening', 'listening_sessions', 20, 150),
  ('口语高手', '完成20次口语练习', '🎤', 'speaking', 'speaking_sessions', 20, 150),
  ('阅读专家', '完成20次阅读练习', '📖', 'reading', 'reading_sessions', 20, 150),
  ('写作能手', '完成20次写作练习', '✍️', 'writing', 'writing_sessions', 20, 150)
ON CONFLICT DO NOTHING;