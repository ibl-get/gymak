export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: number
          name: string
          membershipType: string
          phone: string
          joinDate: string
          endDate: string
          status: string
          image: string
          isPresent: boolean
          attendanceCount: number
          visitHours: number[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['members']['Insert']>
      }
      settings: {
        Row: {
          id: number
          name: string
          logo: string
          openingTime: string
          closingTime: string
          gradientFrom: string
          gradientTo: string
          backgroundImage: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
    }
  }
}
