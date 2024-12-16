import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import MemberCard from '../components/MemberCard'
import { getMembersList, toggleMemberAttendance } from '../data/members'
import { Member } from '../types/Member'

function PresentMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchId, setSearchId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const allMembers = getMembersList()
    setMembers(allMembers.filter(member => member.isPresent))
  }, [])

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    const allMembers = getMembersList()
    const member = allMembers.find(m => m.id === parseInt(searchId))
    
    if (!member) {
      setError('لم يتم العثور على عضو بهذا الرقم')
      return
    }

    if (member.isPresent) {
      setError('هذا العضو مسجل حضوره بالفعل')
      return
    }

    const updatedMembers = toggleMemberAttendance(member.id)
    setMembers(updatedMembers.filter(m => m.isPresent))
    setSearchId('')
    setError('')
  }

  const handleToggleAttendance = (memberId: number) => {
    const updatedMembers = toggleMemberAttendance(memberId)
    setMembers(updatedMembers.filter(m => m.isPresent))
  }

  return (
    <div className="container mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">الأعضاء الحاضرين</h1>
        <p className="text-gray-300">قائمة الأعضاء المتواجدين حالياً في النادي</p>
      </header>

      <div className="max-w-md mx-auto mb-12">
        <form onSubmit={handleAddMember} className="relative">
          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="أدخل رقم العضو لتسجيل حضوره"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
          <button
            type="submit"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white hover:text-blue-400 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
        {error && (
          <p className="mt-2 text-red-400 text-sm text-center">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rtl">
        {members.map((member) => (
          <MemberCard 
            key={member.id} 
            member={member}
            onToggleAttendance={handleToggleAttendance}
          />
        ))}
        {members.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">
            لا يوجد أعضاء حاضرين حالياً
          </div>
        )}
      </div>
    </div>
  )
}

export default PresentMembers
