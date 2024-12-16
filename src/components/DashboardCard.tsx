import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  count: number | string
  icon: ReactNode
  color: string
  description?: string
  showAsTime?: boolean
}

const DashboardCard = ({ 
  title, 
  count, 
  icon, 
  color, 
  description = "إجمالي",
  showAsTime = false 
}: DashboardCardProps) => {
  // Map gradient colors to specific hover colors
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { icon: string, text: string } } = {
      'from-blue-400': {
        icon: 'group-hover:text-blue-400 transition-colors duration-300',
        text: 'group-hover:text-blue-400'
      },
      'from-purple-400': {
        icon: 'group-hover:text-purple-400 transition-colors duration-300',
        text: 'group-hover:text-purple-400'
      },
      'from-green-400': {
        icon: 'group-hover:text-green-400 transition-colors duration-300',
        text: 'group-hover:text-green-400'
      },
      'from-orange-400': {
        icon: 'group-hover:text-orange-400 transition-colors duration-300',
        text: 'group-hover:text-orange-400'
      }
    }
    return colorMap[color] || { icon: '', text: '' }
  }

  const colorClasses = getColorClasses(color)

  return (
    <div className="relative group transform transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 ${color} to-transparent opacity-50 blur-xl group-hover:opacity-75 transition-opacity rounded-xl`}></div>
      <div className="relative p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Icon with synchronized transition */}
          <div className={`text-white/80 ${colorClasses.icon}`}>
            {icon}
          </div>
          {/* Title with synchronized transition */}
          <h3 className={`text-xl font-bold text-white/90 transition-colors duration-300 ${colorClasses.text}`}>
            {title}
          </h3>
        </div>
        <div className="mt-4">
          <p className={`text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300 ${showAsTime ? 'font-mono' : ''}`}>
            {count}
          </p>
          <p className="text-sm text-gray-300 mt-1 transform transition-all duration-300 group-hover:text-white/90 group-hover:translate-x-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard
