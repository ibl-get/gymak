export interface Member {
  id: number
  name: string
  membershipType: string
  phone: string
  joinDate: string
  endDate: string
  status: string
  image: string
  isPresent?: boolean
  attendanceCount: number
  visitHours: number[] // Track the hours when members visit
}
