import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const isLockScreen = location.pathname === '/lock'

    if (!isAuthenticated && !isLockScreen) {
      navigate('/lock')
    }
  }, [navigate, location])

  return <>{children}</>
}

export default AuthGuard
