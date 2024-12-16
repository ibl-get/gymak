import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Key, Lock } from 'lucide-react'
import { getGymSettings } from '../data/settings'
import type { GymSettings } from '../types/GymSettings'

const LockScreen = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [settings, setSettings] = useState<GymSettings>(getGymSettings())
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (isAuthenticated === 'true') {
      navigate('/')
    }

    // Get gym settings
    const gymSettings = getGymSettings()
    setSettings(gymSettings)

    // Set default password if not set
    const storedPassword = localStorage.getItem('gymPassword')
    if (!storedPassword) {
      localStorage.setItem('gymPassword', '1234') // Default password
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  useEffect(() => {
    if (showPasswordInput) {
      passwordInputRef.current?.focus()
    }
  }, [showPasswordInput])

  const handleInitialClick = () => {
    if (!showPasswordInput && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setShowPasswordInput(true)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const storedPassword = localStorage.getItem('gymPassword')
    
    if (password === storedPassword) {
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/')
    } else {
      setError('كلمة المرور غير صحيحة')
      setPassword('')
    }
  }

  // Format time in 24-hour format with English numerals
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  // Custom function to format date with Arabic weekday and Gregorian month
  const formatDate = (date: Date) => {
    const weekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    
    const weekday = weekdays[date.getDay()]
    const day = date.getDate().toString()
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString()

    return `${weekday} ${day} ${month} ${year}`
  }

  const formattedDate = formatDate(currentTime)

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      onClick={handleInitialClick}
    >
      {/* Semi-transparent overlay when password input is shown */}
      {showPasswordInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md transition-all duration-300" />
      )}

      <div className="w-full max-w-md z-10">
        <div 
          className={`transition-all duration-300 ease-in-out transform ${
            isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {!showPasswordInput ? (
            // Clock and Date Display
            <div className="glass p-8 rounded-xl animate-fade-in">
              {settings.logo && (
                <img 
                  src={settings.logo} 
                  alt={settings.name}
                  className="w-24 h-24 rounded-full mx-auto mb-8 border-2 border-white/20"
                />
              )}
              <div className="text-7xl font-bold text-white mb-4 font-mono tracking-wider text-center">
                {formattedTime}
              </div>
              <div className="text-2xl text-white/90 font-light text-center">
                {formattedDate}
              </div>
              <div className="mt-8 text-white/50 text-sm text-center">
                انقر في أي مكان لتسجيل الدخول
              </div>
            </div>
          ) : (
            // Password Input Form
            <div className="animate-fade-in text-center">
              {settings.logo && (
                <img 
                  src={settings.logo} 
                  alt={settings.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/20"
                />
              )}
              <h1 className="text-3xl font-bold text-white mb-2">{settings.name}</h1>
              <p className="text-white/70 mb-8">أدخل كلمة المرور للدخول</p>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="max-w-xs mx-auto">
                  <input
                    ref={passwordInputRef}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="كلمة المرور"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    dir="ltr"
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className="text-red-400 animate-fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Key className="w-5 h-5" />
                  <span>دخول</span>
                </button>
              </form>

              <div className="mt-6">
                <p className="text-sm text-white/50">
                  كلمة المرور الافتراضية هي: 1234
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LockScreen
