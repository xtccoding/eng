import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { signUp, signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName)
        if (error) {
          setError(error.message)
        } else {
          setSuccess('注册成功！请查看邮箱确认。')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError('发生错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md animate-ios-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="ios-title">EngFlow</h1>
          <p className="ios-body text-muted-foreground mt-2">
            {isSignUp ? '创建账号开始学习' : '登录继续学习'}
          </p>
        </div>

        {/* 表单 */}
        <div className="ios-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="ios-caption font-medium mb-2 block">
                  昵称
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="输入昵称"
                    className="ios-input pl-12 w-full"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="ios-caption font-medium mb-2 block">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入邮箱"
                  required
                  className="ios-input pl-12 w-full"
                />
              </div>
            </div>

            <div>
              <label className="ios-caption font-medium mb-2 block">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  required
                  minLength={6}
                  className="ios-input pl-12 w-full"
                />
              </div>
            </div>

            {error && (
              <div className="ios-card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <p className="ios-caption text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="ios-card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <p className="ios-caption text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ios-button w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? '注册' : '登录'}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setSuccess(null)
              }}
              className="ios-caption text-blue-500 hover:text-blue-600"
            >
              {isSignUp ? '已有账号？登录' : '没有账号？注册'}
            </button>
          </div>
        </div>

        {/* 跳过登录 */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="ios-caption text-muted-foreground hover:text-foreground"
          >
            跳过登录，先体验
          </button>
        </div>
      </div>
    </div>
  )
}