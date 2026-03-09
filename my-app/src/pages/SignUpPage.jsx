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

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

function SignUpPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    const users = getUsers()
    const exists = users.some((u) => u.email === trimmedEmail)

    if (exists) {
      setError('User already exists')
      return
    }

    const newUser = {
      fullName: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    setInfo('Account created successfully. Redirecting to Sign In...')

    setTimeout(() => {
      navigate('/signin')
    }, 1000)
  }

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <div className="logo-circle">FS</div>
          <h1 className="card-title">Create your account</h1>
          <p className="card-subtitle">
            Join FirstSource to access the AI Document Collection Agent.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="form-helper">Minimum 6 characters.</span>
          </div>

          {error && <div className="error-message">{error}</div>}
          {info && <div className="success-message">{info}</div>}

          <button type="submit" className="btn btn-primary mt-10">
            Create Account
          </button>
        </form>

        <div className="form-footer">
          Already have an account? <Link to="/signin">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage

