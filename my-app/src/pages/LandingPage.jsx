import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <div className="logo-circle">FS</div>
          <h1 className="card-title">Welcome to FirstSource</h1>
          <p className="card-subtitle">
            Securely access your AI-powered Document Collection Agent.
          </p>
        </div>

        <p className="form-helper center mb-16">
          Sign in if you already have an account, or create a new one in a few seconds.
        </p>

        <div className="btn-row center">
          <button className="btn btn-primary" onClick={() => navigate('/signin')}>
            Sign In
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

