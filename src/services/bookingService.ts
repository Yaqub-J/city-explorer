import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase'
import { notificationsService } from './notificationsService'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface Booking {
  id: string
  user_id: string
  business_id: string
  date: string
  time: string
  party_size: number
  special_requests?: string
  status: BookingStatus
  confirmation_code: string
  contact_info: {
    name: string
    phone: string
    email: string
  }
  created_at: string
  updated_at: string
  business?: Tables<'businesses'>
  user?: Tables<'profiles'>
}

export interface CreateBookingPayload {
  business_id: string
  date: string
  time: string
  party_size: number
  special_requests?: string
  contact_info: {
    name: string
    phone: string
    email: string
  }
}

export interface BookingAvailability {
  date: string
  available_slots: string[]
  fully_booked: boolean
}

export interface BusinessBookingSettings {
  business_id: string
  booking_enabled: boolean
  advance_booking_days: number
  min_party_size: number
  max_party_size: number
  booking_window_start: string // e.g., "09:00"
  booking_window_end: string // e.g., "22:00"
  time_slot_duration: number // in minutes
  slots_per_time: number // how many bookings per time slot
  days_of_week: number[] // 0-6, Sunday-Saturday
  special_dates: Array<{
    date: string
    closed: boolean
    special_hours?: { start: string; end: string }
  }>
}

class BookingService {
  // Create a new booking
  async createBooking(userId: string, payload: CreateBookingPayload): Promise<Booking | null> {
    try {
      // Generate confirmation code
      const confirmationCode = this.generateConfirmationCode()

      const bookingData = {
        user_id: userId,
        ...payload,
        status: 'pending' as BookingStatus,
        confirmation_code: confirmationCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData as any])
        .select(`
          *,
          business:businesses(*),
          user:profiles(*)
        `)
        .single()

      if (error) throw error

      // Send confirmation notification
      if ((data as any).business) {
        await notificationsService.notifyBookingConfirmation(
          userId,
          (data as any).business.name,
          payload.date,
          payload.time
        )

        // Notify business owner
        if ((data as any).business.owner_id) {
          await notificationsService.createNotification({
            user_id: (data as any).business.owner_id,
            type: 'booking_confirmation',
            title: 'New Booking Received',
            message: `${payload.contact_info.name} booked a table for ${payload.party_size} people on ${payload.date} at ${payload.time}`,
            data: { booking_id: (data as any).id, confirmation_code: confirmationCode }
          })
        }
      }

      return data as any
    } catch (error) {
      console.error('Error creating booking:', error)
      return null
    }
  }

  // Get user's bookings
  async getUserBookings(
    userId: string,
    options: {
      status?: BookingStatus
      limit?: number
      upcoming_only?: boolean
    } = {}
  ): Promise<Booking[]> {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          business:businesses(*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: true })

      if (options.status) {
        query = query.eq('status', options.status)
      }

      if (options.upcoming_only) {
        const today = new Date().toISOString().split('T')[0]
        query = query.gte('date', today)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  }

  // Get business bookings
  async getBusinessBookings(
    businessId: string,
    options: {
      status?: BookingStatus
      date?: string
      limit?: number
    } = {}
  ): Promise<Booking[]> {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('business_id', businessId)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (options.status) {
        query = query.eq('status', options.status)
      }

      if (options.date) {
        query = query.eq('date', options.date)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching business bookings:', error)
      return []
    }
  }

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          business:businesses(*),
          user:profiles(*)
        `)
        .single()

      if (error) throw error

      // Send notification about status change
      if (data && data.user_id && data.business) {
        const statusMessages: Record<BookingStatus, string> = {
          pending: 'Your booking is pending confirmation',
          confirmed: 'Your booking has been confirmed',
          cancelled: 'Your booking has been cancelled',
          completed: 'Thank you for visiting us',
          no_show: 'You missed your booking'
        }

        if (statusMessages[status]) {
          await notificationsService.createNotification({
            user_id: data.user_id,
            type: 'booking_confirmation',
            title: 'Booking Update',
            message: `${statusMessages[status]} at ${data.business.name}`,
            data: { booking_id: bookingId, status }
          })
        }
      }

      return true
    } catch (error) {
      console.error('Error updating booking status:', error)
      return false
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, userId: string): Promise<boolean> {
    try {
      // Check if booking belongs to user and is cancellable
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .single()

      if (fetchError || !booking) {
        throw new Error('Booking not found or not authorized')
      }

      if (booking.status === 'cancelled' || booking.status === 'completed') {
        throw new Error('Cannot cancel this booking')
      }

      // Check if it's within cancellation window (e.g., 2 hours before)
      const bookingDateTime = new Date(`${booking.date}T${booking.time}`)
      const now = new Date()
      const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (hoursUntilBooking < 2) {
        throw new Error('Cannot cancel within 2 hours of booking time')
      }

      return await this.updateBookingStatus(bookingId, 'cancelled', userId)
    } catch (error) {
      console.error('Error cancelling booking:', error)
      return false
    }
  }

  // Get booking availability for a business
  async getBookingAvailability(
    businessId: string,
    date: string
  ): Promise<BookingAvailability> {
    try {
      // Get business booking settings
      const settings = await this.getBusinessBookingSettings(businessId)

      if (!settings || !settings.booking_enabled) {
        return {
          date,
          available_slots: [],
          fully_booked: true
        }
      }

      // Check if the date is a valid booking day
      const requestDate = new Date(date)
      const dayOfWeek = requestDate.getDay()

      if (!settings.days_of_week.includes(dayOfWeek)) {
        return {
          date,
          available_slots: [],
          fully_booked: true
        }
      }

      // Check for special dates
      const specialDate = settings.special_dates.find(sd => sd.date === date)
      if (specialDate && specialDate.closed) {
        return {
          date,
          available_slots: [],
          fully_booked: true
        }
      }

      // Generate time slots
      const slots = this.generateTimeSlots(settings, date)

      // Get existing bookings for the date
      const existingBookings = await this.getBusinessBookings(businessId, {
        date,
        status: 'confirmed'
      })

      // Filter out unavailable slots
      const availableSlots = slots.filter(slot => {
        const slotBookings = existingBookings.filter(booking => booking.time === slot)
        return slotBookings.length < settings.slots_per_time
      })

      return {
        date,
        available_slots: availableSlots,
        fully_booked: availableSlots.length === 0
      }
    } catch (error) {
      console.error('Error fetching booking availability:', error)
      return {
        date,
        available_slots: [],
        fully_booked: true
      }
    }
  }

  // Get or create business booking settings
  async getBusinessBookingSettings(businessId: string): Promise<BusinessBookingSettings | null> {
    try {
      const { data, error } = await supabase
        .from('business_booking_settings')
        .select('*')
        .eq('business_id', businessId)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error
      }

      if (!data) {
        // Create default settings
        const defaultSettings: Omit<BusinessBookingSettings, 'business_id'> = {
          booking_enabled: true,
          advance_booking_days: 30,
          min_party_size: 1,
          max_party_size: 12,
          booking_window_start: '09:00',
          booking_window_end: '21:00',
          time_slot_duration: 30,
          slots_per_time: 3,
          days_of_week: [1, 2, 3, 4, 5, 6], // Monday to Saturday
          special_dates: []
        }

        const { data: newSettings, error: createError } = await supabase
          .from('business_booking_settings')
          .insert([{ business_id: businessId, ...defaultSettings }])
          .select()
          .single()

        if (createError) throw createError
        return newSettings
      }

      return data
    } catch (error) {
      console.error('Error fetching booking settings:', error)
      return null
    }
  }

  // Update business booking settings
  async updateBusinessBookingSettings(
    businessId: string,
    settings: Partial<BusinessBookingSettings>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_booking_settings')
        .upsert({
          business_id: businessId,
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating booking settings:', error)
      return false
    }
  }

  // Get booking by confirmation code
  async getBookingByConfirmationCode(code: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          business:businesses(*),
          user:profiles(*)
        `)
        .eq('confirmation_code', code)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching booking by confirmation code:', error)
      return null
    }
  }

  // Private helper methods
  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private generateTimeSlots(settings: BusinessBookingSettings, date: string): string[] {
    const slots: string[] = []

    // Use special hours if available
    const specialDate = settings.special_dates.find(sd => sd.date === date)
    const startTime = specialDate?.special_hours?.start || settings.booking_window_start
    const endTime = specialDate?.special_hours?.end || settings.booking_window_end

    const start = this.timeToMinutes(startTime)
    const end = this.timeToMinutes(endTime)

    for (let time = start; time < end; time += settings.time_slot_duration) {
      slots.push(this.minutesToTime(time))
    }

    return slots
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Get booking statistics for business
  async getBookingStats(businessId: string, period: 'today' | 'week' | 'month' = 'today') {
    try {
      const today = new Date()
      let startDate: string

      switch (period) {
        case 'today':
          startDate = today.toISOString().split('T')[0]
          break
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          startDate = weekAgo.toISOString().split('T')[0]
          break
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          startDate = monthAgo.toISOString().split('T')[0]
          break
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('status')
        .eq('business_id', businessId)
        .gte('date', startDate)

      if (error) throw error

      const stats = {
        total: data.length,
        confirmed: data.filter(b => b.status === 'confirmed').length,
        pending: data.filter(b => b.status === 'pending').length,
        cancelled: data.filter(b => b.status === 'cancelled').length,
        completed: data.filter(b => b.status === 'completed').length,
        no_show: data.filter(b => b.status === 'no_show').length
      }

      return stats
    } catch (error) {
      console.error('Error fetching booking stats:', error)
      return null
    }
  }
}

export const bookingService = new BookingService()
export default bookingService