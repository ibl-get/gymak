import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import MemberCard from '../components/MemberCard'
import AddMemberForm from '../components/AddMemberForm'
import EditMemberForm from '../components/EditMemberForm'
import { getMembersList, toggleMemberAttendance, addNewMember, updateMember, deleteMember } from '../data/members'
import { Member } from '../types/Member'

function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiringSoon' | 'expired'>('all')
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])

  useEffect(() => {
    setMembers(getMembersList())
  }, [])

  useEffect(() => {
    let filtered = members

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchLower) || 
        member.id.toString().padStart(4, '0').includes(searchTerm)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const currentDate = new Date()
      filtered = filtered.filter(member => {
        const endDate = new Date(member.endDate)
        const diffTime = endDate.getTime() - currentDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (statusFilter) {
          case 'active':
            return diffDays > 5
          case 'expiringSoon':
            return diffDays > 0 && diffDays <= 5
          case 'expired':
            return diffDays <= 0
          default:
            return true
        }
      })
    }

    setFilteredMembers(filtered)
  }, [members, searchTerm, statusFilter])

  const handleToggleAttendance = (memberId: number) => {
    const updatedMembers = toggleMemberAttendance(memberId)
    setMembers(updatedMembers)
  }

  const handleAddMember = (memberData: {
    name: string
    phone: string
    membershipType: string
    joinDate: string
    endDate: string
    image: string
  }) => {
    const updatedMembers = addNewMember(memberData)
    setMembers(updatedMembers)
  }

  const handleEditMember = (memberData: Member) => {
    const updatedMembers = updateMember(memberData)
    setMembers(updatedMembers)
    setEditingMember(null)
  }

  const handleDeleteMember = (memberId: number) => {
    const updatedMembers = deleteMember(memberId)
    setMembers(updatedMembers)
  }

  return (
    <div className="container mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">الأعضاء المسجلين</h1>
        <p className="text-gray-300">قائمة بجميع الأعضاء المسجلين في النادي</p>
      </header>

      <AddMemberForm onSubmit={handleAddMember} />

      {/* Search and Filter Section */}
      <div className="mb-8 glass rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم العضو أو رقم العضوية"
              className="w-full px-4 py-2 pr-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 items-center">
            <span className="text-white whitespace-nowrap">حالة العضوية:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'expiringSoon' | 'expired')}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 min-w-[180px]"
              dir="rtl"
            >
              <option value="all">جميع الأعضاء</option>
              <option value="active">العضويات النشطة</option>
              <option value="expiringSoon">تنتهي قريباً (خلال ٥ أيام)</option>
              <option value="expired">العضويات المنتهية</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-gray-300 text-sm">
          عدد النتائج: {filteredMembers.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rtl">
        {filteredMembers.map((member) => (
          <MemberCard 
            key={member.id} 
            member={member} 
            onToggleAttendance={handleToggleAttendance}
            showAdminControls={true}
            onEdit={setEditingMember}
            onDelete={handleDeleteMember}
          />
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">
            لا توجد نتائج للبحث
          </div>
        )}
      </div>

      {editingMember && (
        <EditMemberForm
          member={editingMember}
          onSubmit={handleEditMember}
          onClose={() => setEditingMember(null)}
        />
      )}
    </div>
  )
}

export default Members
