import { Calendar, Phone, Trophy, UserCheck, Clock, Trash2, Edit2, UserCog } from 'lucide-react'
import { Member } from '../types/Member'

interface MemberCardProps {
  member: Member
  onToggleAttendance: (id: number) => void
  showAdminControls?: boolean
  onEdit?: (member: Member) => void
  onDelete?: (id: number) => void
}

const MemberCard = ({ 
  member, 
  onToggleAttendance, 
  showAdminControls = false,
  onEdit,
  onDelete 
}: MemberCardProps) => {
  // Calculate remaining days
  const calculateRemainingDays = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const remainingDays = calculateRemainingDays(member.endDate)
  const isExpiringSoon = remainingDays <= 5 && remainingDays > 0
  const isExpired = remainingDays <= 0

  const getSubscriptionStatusColor = () => {
    if (isExpired) return 'bg-red-500/20 text-red-300'
    if (isExpiringSoon) return 'bg-yellow-500/20 text-yellow-300'
    return 'bg-green-500/20 text-green-300'
  }

  const getSubscriptionStatus = () => {
    if (isExpired) return 'منتهي'
    if (isExpiringSoon) return 'قارب على الانتهاء'
    return 'نشط'
  }

  const handleDelete = () => {
    if (onDelete && window.confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      onDelete(member.id)
    }
  }

  // Format member ID to be 4 digits
  const formattedMemberId = member.id.toString().padStart(4, '0')

  return (
    <div className="relative group">
      <div className="absolute inset-0 from-blue-400 to-transparent opacity-50 blur-xl group-hover:opacity-75 transition-opacity rounded-xl"></div>
      <div className="relative p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
        {/* Member ID Badge */}
        <div className="absolute top-4 left-4 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="text-white font-bold">#{formattedMemberId}</span>
        </div>

        {/* Admin Controls */}
        {showAdminControls && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => onEdit && onEdit(member)}
              className="p-2 rounded-full bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-colors"
              title="تعديل العضو"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              title="حذف العضو"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-end">
          {/* Member Image */}
          <div className="w-full flex justify-center mb-4">
            <div className="relative">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-white/30"
              />
              <button
                onClick={() => onToggleAttendance(member.id)}
                className={`absolute -bottom-2 -left-2 p-2 rounded-full transition-colors ${
                  member.isPresent 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
                title={member.isPresent ? 'تسجيل غياب' : 'تسجيل حضور'}
              >
                <UserCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
          
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <span>{member.membershipType}</span>
            <Trophy className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <span>{member.phone}</span>
            <Phone className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <span>تاريخ الانضمام: {member.joinDate}</span>
            <Calendar className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <span>تاريخ الانتهاء: {member.endDate}</span>
            <Clock className="w-4 h-4" />
          </div>

          {/* Attendance Count */}
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <span>عدد مرات الحضور: {member.attendanceCount || 0}</span>
            <UserCog className="w-4 h-4" />
          </div>

          <div className="mt-4 w-full">
            <div className="text-sm text-gray-300">حالة العضوية</div>
            <div className="mt-1 flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full ${getSubscriptionStatusColor()} text-sm`}>
                {getSubscriptionStatus()}
                {!isExpired && ` (${remainingDays} يوم)`}
              </span>
              {member.isPresent && (
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                  حاضر
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberCard
