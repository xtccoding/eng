import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/common/Header'
import { Sidebar } from './components/common/Sidebar'
import { Footer } from './components/common/Footer'
import { Home } from './pages/Home'
import { TypingPractice } from './pages/TypingPractice'
import { ContentLibrary } from './pages/ContentLibrary'
import { ProgressDashboard } from './pages/ProgressDashboard'
import { Settings } from './pages/Settings'
import { Generation } from './pages/Generation'
import { Leaderboard } from './pages/Leaderboard'
import { Achievements } from './pages/Achievements'
import { Pronunciation } from './pages/Pronunciation'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/typing" element={<TypingPractice />} />
              <Route path="/content" element={<ContentLibrary />} />
              <Route path="/progress" element={<ProgressDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/generation" element={<Generation />} />
              <Route path="/pronunciation" element={<Pronunciation />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App