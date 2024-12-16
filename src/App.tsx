import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import PresentMembers from './pages/PresentMembers'
import Settings from './pages/Settings'
import LockScreen from './pages/LockScreen'
import Navbar from './components/Navbar'
import GymHeader from './components/GymHeader'
import AuthGuard from './components/AuthGuard'
import { useEffect, useState } from 'react'
import { getGymSettings } from './data/settings'

function App() {
  const [settings, setSettings] = useState(getGymSettings())

  useEffect(() => {
    const handleSettingsChange = () => {
      const updatedSettings = getGymSettings() // Get fresh settings from localStorage
      setSettings(updatedSettings)
    }

    // Listen for settings changes
    window.addEventListener('settingsUpdated', handleSettingsChange)
    
    // Clean up
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsChange)
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        {/* Background div with fixed positioning */}
        {settings.backgroundImage ? (
          <>
            {/* Full-screen background image */}
            <div 
              className="fixed inset-0 z-0"
              style={{
                backgroundImage: `url(${settings.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.3)', // Darken the background image
                width: '100%',
                height: '100%'
              }}
            />
          </>
        ) : (
          // Gradient background when no image is set
          <div 
            className="fixed inset-0 z-0"
            style={{
              background: `linear-gradient(to bottom right, ${settings.gradientFrom}, ${settings.gradientTo})`,
              width: '100%',
              height: '100%'
            }}
          />
        )}
        
        {/* Content container */}
        <div className="relative z-10">
          <Routes>
            <Route path="/lock" element={<LockScreen />} />
            <Route path="*" element={
              <AuthGuard>
                <>
                  <GymHeader />
                  <Navbar />
                  <div className="p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard key={settings.openingTime + settings.closingTime} />} />
                      <Route path="/members" element={<Members />} />
                      <Route path="/present" element={<PresentMembers />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </div>
                </>
              </AuthGuard>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
