import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ar } from 'date-fns/locale'
import { getMembersList } from '../data/members'
import type { Member } from '../types/Member'

const ActivityCharts = () => {
  const [dailyData, setDailyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])

  useEffect(() => {
    const members = getMembersList()
    
    // Generate daily data for the last 7 days
    const generateDailyData = () => {
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i)
        const dayStr = format(date, 'yyyy-MM-dd')
        const count = members.filter(m => {
          const joinDate = new Date(m.joinDate)
          return format(joinDate, 'yyyy-MM-dd') === dayStr
        }).length

        return {
          date: format(date, 'EEEE', { locale: ar }),
          visits: count
        }
      }).reverse()
    }

    // Generate monthly data
    const generateMonthlyData = () => {
      const start = startOfMonth(new Date())
      const end = endOfMonth(new Date())
      const days = eachDayOfInterval({ start, end })

      return days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd')
        const count = members.filter(m => {
          const joinDate = new Date(m.joinDate)
          return format(joinDate, 'yyyy-MM-dd') === dayStr
        }).length

        return {
          date: format(day, 'd MMM', { locale: ar }),
          visits: count
        }
      })
    }

    // Generate hourly data
    const generateHourlyData = () => {
      // Create an array for all 24 hours
      const hourlyVisits = Array.from({ length: 24 }, (_, hour) => {
        // Get all visit hours and count occurrences of this hour
        const visits = members.flatMap(m => m.visitHours || [])
          .filter(h => h === hour).length

        return {
          hour: hour.toString().padStart(2, '0') + ':00',
          visits
        }
      })

      return hourlyVisits
    }

    setDailyData(generateDailyData())
    setMonthlyData(generateMonthlyData())
    setHourlyData(generateHourlyData())
  }, [])

  return (
    <div className="space-y-8">
      {/* Daily Activity Chart (Previously Hourly) */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">النشاط اليومي</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="hour" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`${value} زيارة`, 'عدد الزيارات']}
                labelFormatter={(label) => `الساعة ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="visits" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorHourly)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Activity Chart (Previously Daily) */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">النشاط الاسبوعي</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="visits" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorDaily)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">النشاط الشهري</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="visits" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorMonthly)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ActivityCharts
