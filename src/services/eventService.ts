import { supabase, type Tables } from '@/lib/supabase'

export type Event = Tables<'events'>
export type EventInsert = {
  business_id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location: string
  image_url?: string
  price?: number
  capacity?: number
  category: string
}

export class EventService {
  // Get all events with optional filtering
  static async getEvents(options?: {
    business_id?: string
    category?: string
    city?: string
    upcoming?: boolean
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('events')
      .select(`
        *,
        businesses (
          id,
          name,
          city,
          image_url
        )
      `)
      .order('start_date', { ascending: true })

    if (options?.business_id) {
      query = query.eq('business_id', options.business_id)
    }

    if (options?.category) {
      query = query.eq('category', options.category)
    }

    if (options?.upcoming) {
      query = query.gte('start_date', new Date().toISOString())
    }

    if (options?.city) {
      query = query.eq('businesses.city', options.city)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`)
    }

    return data
  }

  // Get a single event by ID
  static async getEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        businesses (
          id,
          name,
          address,
          city,
          phone,
          email,
          website,
          image_url,
          profiles:owner_id (
            full_name,
            email
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch event: ${error.message}`)
    }

    return data
  }

  // Create a new event
  static async createEvent(event: EventInsert) {
    const { data, error } = await supabase
      .from('events')
      .insert(event as any)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`)
    }

    return data
  }

  // Update an event
  static async updateEvent(id: string, updates: Partial<EventInsert>) {
    // @ts-ignore - Temporary workaround for Supabase types
    const { data, error } = await supabase
      .from('events')
      // @ts-ignore
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`)
    }

    return data
  }

  // Delete an event
  static async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`)
    }
  }

  // Register for an event
  static async registerForEvent(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated to register for events')
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        user_id: user.id,
        event_id: eventId
      } as any)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to register for event: ${error.message}`)
    }

    return data
  }

  // Cancel event registration
  static async cancelRegistration(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated')
    }

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to cancel registration: ${error.message}`)
    }
  }

  // Check if user is registered for an event
  static async isRegistered(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check registration: ${error.message}`)
    }

    return !!data
  }

  // Get user's registered events
  static async getUserRegistrations(userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events (
          *,
          businesses (
            name,
            city
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user registrations: ${error.message}`)
    }

    return data
  }

  // Search events
  static async searchEvents(query: string, options?: {
    category?: string
    city?: string
    upcoming?: boolean
    limit?: number
  }) {
    let supabaseQuery = supabase
      .from('events')
      .select(`
        *,
        businesses (
          name,
          city
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('start_date', { ascending: true })

    if (options?.category) {
      supabaseQuery = supabaseQuery.eq('category', options.category)
    }

    if (options?.upcoming) {
      supabaseQuery = supabaseQuery.gte('start_date', new Date().toISOString())
    }

    if (options?.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit)
    }

    const { data, error } = await supabaseQuery

    if (error) {
      throw new Error(`Failed to search events: ${error.message}`)
    }

    return data
  }

  // Get event categories
  static async getCategories() {
    const { data, error } = await supabase
      .from('events')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    // Extract unique categories
    const categories = [...new Set((data as any[]).map(item => item.category))]
    return categories.sort()
  }
}