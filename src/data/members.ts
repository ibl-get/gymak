import { supabase } from '../lib/supabase'
import type { Member } from '../types/Member'

// Get all members
export const getMembersList = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }

  return data
}

// Toggle member attendance
export const toggleMemberAttendance = async (memberId: number): Promise<Member[]> => {
  // First get the current member to check their status
  const { data: member, error: fetchError } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single()

  if (fetchError) {
    console.error('Error fetching member:', fetchError)
    return getMembersList()
  }

  const currentHour = new Date().getHours()
  const newIsPresent = !member.isPresent
  const newAttendanceCount = newIsPresent ? member.attendanceCount + 1 : member.attendanceCount
  const newVisitHours = newIsPresent 
    ? [...member.visitHours, currentHour]
    : member.visitHours

  const { error: updateError } = await supabase
    .from('members')
    .update({ 
      isPresent: newIsPresent,
      attendanceCount: newAttendanceCount,
      visitHours: newVisitHours
    })
    .eq('id', memberId)

  if (updateError) {
    console.error('Error updating member:', updateError)
  }

  return getMembersList()
}

// Add new member
export const addNewMember = async (newMember: Omit<Member, 'id' | 'isPresent' | 'status' | 'attendanceCount' | 'visitHours'>): Promise<Member[]> => {
  const memberToAdd = {
    ...newMember,
    isPresent: false,
    status: "نشط",
    attendanceCount: 0,
    visitHours: []
  }

  const { error } = await supabase
    .from('members')
    .insert(memberToAdd)

  if (error) {
    console.error('Error adding member:', error)
  }

  return getMembersList()
}

// Update existing member
export const updateMember = async (updatedMember: Member): Promise<Member[]> => {
  const { error } = await supabase
    .from('members')
    .update(updatedMember)
    .eq('id', updatedMember.id)

  if (error) {
    console.error('Error updating member:', error)
  }

  return getMembersList()
}

// Delete member
export const deleteMember = async (memberId: number): Promise<Member[]> => {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId)

  if (error) {
    console.error('Error deleting member:', error)
  }

  return getMembersList()
}
