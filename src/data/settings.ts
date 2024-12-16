import { supabase } from '../lib/supabase'
import type { GymSettings } from '../types/GymSettings'

const defaultSettings: GymSettings = {
  name: 'نادي جليدة الرياضي',
  logo: '',
  openingTime: '06:00',
  closingTime: '23:00',
  gradientFrom: '#1e3a8a',
  gradientTo: '#581c87',
  backgroundImage: ''
}

export const getGymSettings = async (): Promise<GymSettings> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error || !data) {
    console.error('Error fetching settings:', error)
    // If no settings exist, create default settings
    const { error: insertError } = await supabase
      .from('settings')
      .insert(defaultSettings)

    if (insertError) {
      console.error('Error creating default settings:', insertError)
    }
    return defaultSettings
  }

  return data
}

export const updateGymSettings = async (settings: GymSettings): Promise<void> => {
  try {
    const formatTime = (time: string) => {
      if (!time.includes(':')) {
        time = time + ':00'
      }
      return time.padStart(5, '0')
    }

    const updatedSettings = {
      ...settings,
      openingTime: formatTime(settings.openingTime),
      closingTime: formatTime(settings.closingTime)
    }

    const { error } = await supabase
      .from('settings')
      .update(updatedSettings)
      .eq('id', 1) // Assuming we always use id 1 for settings

    if (error) {
      console.error('Error updating settings:', error)
    }

    // Dispatch event to notify components of the change
    window.dispatchEvent(new Event('settingsUpdated'))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}
