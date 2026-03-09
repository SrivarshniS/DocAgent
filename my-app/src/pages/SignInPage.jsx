import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function getUsers() {
  try {
    const raw = localStorage.getItem('users')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password.')
      return
    }

    const users = getUsers()
    const match = users.find(
      (u) => u.email === trimmedEmail && u.password === trimmedPassword,
    )

    if (!match) {
      setError('Invalid credentials')
      return
    }

    localStorage.setItem('loggedUser', JSON.stringify(match))
    navigate('/agent')
  }

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <div className="logo-circle">FS</div>
          <h1 className="card-title">Sign in to FirstSource</h1>
          <p className="card-subtitle">
            Access your AI Document Collection Agent securely.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary mt-10">
            Sign In
          </button>
        </form>

        <div className="form-footer">
          New to FirstSource? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  )
}

export default SignInPage

