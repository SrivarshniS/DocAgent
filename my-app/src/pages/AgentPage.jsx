import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function getLoggedUser() {
  try {
    const raw = localStorage.getItem('loggedUser')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveUserDetails(fullName, email) {
  try {
    const userDetails = {
      fullName,
      email,
      username: `${fullName}_${email}`,
      collectedAt: new Date().toISOString(),
    }
    localStorage.setItem('agent_userDetails', JSON.stringify(userDetails))
  } catch (error) {
    console.error('Failed to save user details:', error)
  }
}

function getUserDetails() {
  try {
    const raw = localStorage.getItem('agent_userDetails')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function AgentPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(1) // 1: waiting for name/email, 2: waiting for upload confirmation, 3: waiting for experience
  const [userDetails, setUserDetails] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef(null)
  const chatWindowRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (sender, text, delay = 0) => {
    if (delay > 0) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            sender,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }, delay)
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          sender,
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }
  }

  const handleLogout = () => {
    clearUserTimeout()
    localStorage.removeItem('loggedUser')
    localStorage.removeItem('agent_userDetails')
    navigate('/signin', { replace: true })
  }

  const startTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      addMessage(
        'agent',
        'This session will end without saving your data. Please come back later to start the upload process again. Thank you.',
      )
      window.setTimeout(() => {
        handleLogout()
      }, 3000)
    }, 60000)
  }

  const clearUserTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const u = getLoggedUser()
    if (!u) {
      navigate('/signin', { replace: true })
      return
    }
    setUser(u)

    
    const savedDetails = getUserDetails()
    if (savedDetails) {
      setUserDetails(savedDetails)
      setStep(2) 
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: 'Welcome to FirstSource! Please share your Full Name and email id to continue.',
          time,
        },
        {
          id: 2,
          sender: 'user',
          text: `${savedDetails.fullName}, ${savedDetails.email}`,
          time,
        },
        {
          id: 3,
          sender: 'agent',
          text: 'Would you like to start the Document upload process?',
          time,
        },
      ])
    } else {
  
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: 'Welcome to FirstSource! Please share your Full Name and email id to continue.',
          time,
        },
      ])

      startTimeout()
    }
  }, [navigate])

  const extractNameAndEmail = (text) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi
    const emailMatch = text.match(emailRegex)
    const email = emailMatch ? emailMatch[0] : null


    let name = text
    if (email) {
      name = text.substring(0, text.indexOf(email)).trim()

      name = name.replace(/[,;:]$/, '').trim()
    }

    if (name.includes(',')) {
      name = name.split(',')[0].trim()
    }

    return { name: name || null, email }
  }

  const handleConversation = (userText) => {
    const trimmed = userText.trim()
    if (!trimmed) return

    clearUserTimeout()
    startTimeout()

    if (step === 1) {
      const { name, email } = extractNameAndEmail(trimmed)

      if (!name || !email) {
        addMessage(
          'agent',
          'Please provide both your Full Name and Email ID. For example: "John Doe, john.doe@example.com"',
          800,
        )
        return
      }

      saveUserDetails(name, email)
      setUserDetails({ fullName: name, email })
      setStep(2)

      addMessage('agent', 'Would you like to start the Document upload process?', 800)
      return
    }

    if (step === 2) {
      const norm = trimmed.toLowerCase()
      if (norm.includes('yes') || norm === 'y') {
        addMessage('agent', 'Do you have any previous experience or are you a Fresher?', 800)
        setStep(3)
      } else if (norm.includes('no') || norm === 'n') {
        addMessage(
          'agent',
          'No problem. You can let me know whenever you are ready to start the Document upload process.',
          800,
        )
      } else {
        addMessage('agent', 'Please reply with Yes or No so we can proceed.', 800)
      }
      return
    }

    if (step === 3) {
      const norm = trimmed.toLowerCase()
      if (norm.includes('fresher')) {
        addMessage(
          'agent',
          'Thank you for sharing. I will tailor the document checklist for freshers. You can start by preparing your basic identity and education documents.',
          800,
        )
      } else if (norm.includes('experience') || norm.includes('experienced')) {
        addMessage(
          'agent',
          'Understood. I will include work history related documents in your checklist such as experience letters and payslips.',
          800,
        )
      } else {
        addMessage(
          'agent',
          'Got it. I have noted your background and we can proceed with a customized document upload flow.',
          800,
        )
      }
    }
  }

  const handleChipClick = (chipText) => {
    setInput(chipText.replace('E.g. ', '').replace(/"/g, ''))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    addMessage('user', trimmed)
    setInput('')

    setTimeout(() => {
      handleConversation(trimmed)
    }, 300)
  }

  if (!user) {
    return null
  }

  return (
    <div className="app-container agent-layout">
      <div className="card agent-card">
        <header className="agent-header">
          <div className="agent-header-left">
            <div className="logo-circle" style={{ margin: 0 }}>
              FS
            </div>
            <div>
              <div className="card-title small">FirstSource Document Agent</div>
              <div className="agent-user">
                Signed in as {user.fullName} ({user.email})
              </div>
            </div>
          </div>
          <div className="agent-header-right">
            <div className="agent-badge">AI Document Collection</div>
            <button className="btn btn-outline mt-6" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        <main className="agent-main">
          <div className="chat-window" ref={chatWindowRef}>
            {messages.map((m) => (
              <div key={m.id} className={`chat-message-row ${m.sender}`}>
                <div className={`chat-message ${m.sender}`}>
                  {m.text}
                </div>
                <div className="chat-timestamp">{m.time}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message-row agent">
                <div className="chat-message agent typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chip-row">
            {step === 1 && (
              <>
                <button
                  className="chip clickable"
                  onClick={() => handleChipClick('John Doe, john@example.com')}
                >
                  E.g. "John Doe, john@example.com"
                </button>
                <button
                  className="chip clickable"
                  onClick={() => handleChipClick('Jane Smith, jane.smith@company.com')}
                >
                  "Jane Smith, jane.smith@company.com"
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <button
                  className="chip clickable"
                  onClick={() => handleChipClick('Yes, let\'s start')}
                >
                  E.g. "Yes, let's start"
                </button>
                <button className="chip clickable" onClick={() => handleChipClick('Yes')}>
                  "Yes"
                </button>
              </>
            )}
            {step === 3 && (
              <>
                <button
                  className="chip clickable"
                  onClick={() => handleChipClick('I am a Fresher')}
                >
                  E.g. "I am a Fresher"
                </button>
                <button
                  className="chip clickable"
                  onClick={() => handleChipClick('I have experience')}
                >
                  "I have experience"
                </button>
              </>
            )}
          </div>
        </main>

        <footer className="agent-footer">
          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Type your reply and press Enter..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  )
}

export default AgentPage

