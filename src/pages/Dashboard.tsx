import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardCard from '../components/DashboardCard'
import ActivityCharts from '../components/ActivityCharts'
import { UsersRound, Wallet, UserCheck, Clock } from 'lucide-react'
import { getMembersList } from '../data/members'
import { getGymSettings } from '../data/settings'
import { Member } from '../types/Member'

function Dashboard() {
  const [stats, setStats] = useState({
    totalActive: 0,
    presentToday: 0,
    activeSubscriptions: 0,
    nearExpirySubscriptions: 0
  })
  const [timeToClose, setTimeToClose] = useState('')
  const navigate = useNavigate()
  const settings = getGymSettings()

  useEffect(() => {
    const members = getMembersList()
    const currentDate = new Date()

    const calculateStats = (members: Member[]) => {
      const active = members.filter(member => {
        const endDate = new Date(member.endDate)
        return endDate > currentDate
      }).length

      const present = members.filter(member => member.isPresent).length

      // Calculate active and near-expiry subscriptions
      const subscriptionStats = members.reduce((acc, member) => {
        const endDate = new Date(member.endDate)
        const diffTime = endDate.getTime() - currentDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays > 5) {
          acc.active++
        } else if (diffDays > 0 && diffDays <= 5) {
          acc.nearExpiry++
        }
        
        return acc
      }, { active: 0, nearExpiry: 0 })

      setStats({
        totalActive: active,
        presentToday: present,
        activeSubscriptions: subscriptionStats.active,
        nearExpirySubscriptions: subscriptionStats.nearExpiry
      })
    }

    calculateStats(members)
  }, [])

  useEffect(() => {
    const calculateTimeToClose = () => {
      const now = new Date()
      const [hours, minutes] = settings.closingTime.split(':')
      const closeTime = new Date()
      closeTime.setHours(parseInt(hours), parseInt(minutes), 0)

      if (now > closeTime) {
        closeTime.setDate(closeTime.getDate() + 1)
      }

      const diff = closeTime.getTime() - now.getTime()
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000)

      // Format using 24-hour time
      return `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`
    }

    const timer = setInterval(() => {
      setTimeToClose(calculateTimeToClose())
    }, 1000)

    return () => clearInterval(timer)
  }, [settings.closingTime])

  return (
    <div className="container mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">لوحة التحكم الرئيسية</h1>
        <p className="text-gray-300">إحصائيات ومؤشرات أداء النادي</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 rtl mb-12">
        <div onClick={() => navigate('/members')} className="cursor-pointer">
          <DashboardCard 
            title="الأعضاء المسجلين"
            count={stats.totalActive}
            icon={<UsersRound strokeWidth={1.5} className="w-8 h-8" />}
            color="from-blue-400"
            description="عضو مسجل"
          />
        </div>

        <div onClick={() => navigate('/present')} className="cursor-pointer">
          <DashboardCard 
            title="الحضور اليوم"
            count={stats.presentToday}
            icon={<UserCheck strokeWidth={1.5} className="w-8 h-8" />}
            color="from-purple-400"
            description="عضو حاضر"
          />
        </div>

        <div onClick={() => navigate('/members')} className="cursor-pointer">
          <DashboardCard 
            title="الاشتراكات"
            count={`${stats.activeSubscriptions} | ${stats.nearExpirySubscriptions}`}
            icon={<Wallet strokeWidth={1.5} className="w-8 h-8" />}
            color="from-green-400"
            description={`فعال | قارب على الانتهاء`}
          />
        </div>

        <div className="cursor-default">
          <DashboardCard 
            title="الوقت المتبقي"
            count={timeToClose}
            icon={<Clock strokeWidth={1.5} className="w-8 h-8" />}
            color="from-orange-400"
            description="حتى الإغلاق"
            showAsTime={true}
          />
        </div>
      </div>

      {/* Activity Charts */}
      <ActivityCharts />
    </div>
  )
}

export default Dashboard
