import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import AgentPage from './pages/AgentPage'

function isLoggedIn() {
  try {
    return !!localStorage.getItem('loggedUser')
  } catch {
    return false
  }
}

function ProtectedRoute({ children }) {
  const location = useLocation()
  if (!isLoggedIn()) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }
  return children
}

function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="/agent"
          element={
            <ProtectedRoute>
              <AgentPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
