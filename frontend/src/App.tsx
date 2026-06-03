import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Header } from './components/common/Header'
import { Sidebar } from './components/common/Sidebar'
import { Footer } from './components/common/Footer'
import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { Skills } from './pages/Skills'
import { Listening } from './pages/Listening'
import { Speaking } from './pages/Speaking'
import { Reading } from './pages/Reading'
import { Writing } from './pages/Writing'
import { Vocabulary } from './pages/Vocabulary'
import { TypingPractice } from './pages/TypingPractice'
import { ProgressDashboard } from './pages/ProgressDashboard'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'

// 主应用布局
function AppLayout() {
  const { loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/listening" element={<Listening />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/practice" element={<TypingPractice />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App