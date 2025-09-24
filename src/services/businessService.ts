import { supabase, type Tables } from '@/lib/supabase'

export type Business = Tables<'businesses'>
export type BusinessInsert = {
  name: string
  description?: string
  category: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  website?: string
  opening_hours?: Record<string, any>
  image_url?: string
}

export class BusinessService {
  // Get all businesses with optional filtering
  static async getBusinesses(options?: {
    city?: string
    category?: string
    verified?: boolean
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('businesses')
      .select(`
        *,
        profiles:owner_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (options?.city) {
      query = query.ilike('city', `%${options.city}%`)
    }

    if (options?.category) {
      query = query.eq('category', options.category)
    }

    if (options?.verified !== undefined) {
      query = query.eq('verified', options.verified)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch businesses: ${error.message}`)
    }

    return data
  }

  // Get a single business by ID
  static async getBusiness(id: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        profiles:owner_id (
          full_name,
          email,
          phone
        ),
        reviews (
          id,
          rating,
          comment,
          created_at,
          profiles:user_id (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch business: ${error.message}`)
    }

    return data
  }

  // Create a new business
  static async createBusiness(business: BusinessInsert) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated to create a business')
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        ...business,
        owner_id: user.id
      } as any)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create business: ${error.message}`)
    }

    return data
  }

  // Update a business
  static async updateBusiness(id: string, updates: Partial<BusinessInsert>) {
    // @ts-ignore - Temporary workaround for Supabase types
    const { data, error } = await supabase
      .from('businesses')
      // @ts-ignore
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update business: ${error.message}`)
    }

    return data
  }

  // Delete a business
  static async deleteBusiness(id: string) {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete business: ${error.message}`)
    }
  }

  // Get businesses by owner
  static async getBusinessesByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch owner businesses: ${error.message}`)
    }

    return data
  }

  // Search businesses
  static async searchBusinesses(query: string, options?: {
    city?: string
    category?: string
    limit?: number
  }) {
    let supabaseQuery = supabase
      .from('businesses')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false })

    if (options?.city) {
      supabaseQuery = supabaseQuery.ilike('city', `%${options.city}%`)
    }

    if (options?.category) {
      supabaseQuery = supabaseQuery.eq('category', options.category)
    }

    if (options?.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit)
    }

    const { data, error } = await supabaseQuery

    if (error) {
      throw new Error(`Failed to search businesses: ${error.message}`)
    }

    return data
  }

  // Get business categories
  static async getCategories() {
    const { data, error } = await supabase
      .from('businesses')
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