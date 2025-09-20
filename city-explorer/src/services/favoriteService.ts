import { supabase, type Tables } from '@/lib/supabase'

export type Favorite = Tables<'favorites'>

export class FavoriteService {
  // Get user's favorite businesses
  static async getUserFavorites(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id

    if (!targetUserId) {
      throw new Error('User must be authenticated')
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        businesses (
          *,
          profiles:owner_id (
            full_name
          )
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`)
    }

    return data
  }

  // Add a business to favorites
  static async addToFavorites(businessId: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated to add favorites')
    }

    // Check if already favorited
    const isFavorited = await this.isFavorited(businessId)
    if (isFavorited) {
      throw new Error('Business is already in favorites')
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        business_id: businessId
      } as any)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add to favorites: ${error.message}`)
    }

    return data
  }

  // Remove a business from favorites
  static async removeFromFavorites(businessId: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated')
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('business_id', businessId)

    if (error) {
      throw new Error(`Failed to remove from favorites: ${error.message}`)
    }
  }

  // Check if a business is favorited by the current user
  static async isFavorited(businessId: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('business_id', businessId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check favorite status: ${error.message}`)
    }

    return !!data
  }

  // Toggle favorite status
  static async toggleFavorite(businessId: string) {
    const isFavorited = await this.isFavorited(businessId)

    if (isFavorited) {
      await this.removeFromFavorites(businessId)
      return false
    } else {
      await this.addToFavorites(businessId)
      return true
    }
  }

  // Get favorite count for a business
  static async getFavoriteCount(businessId: string) {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)

    if (error) {
      throw new Error(`Failed to get favorite count: ${error.message}`)
    }

    return count || 0
  }

  // Get user's favorite businesses count
  static async getUserFavoritesCount(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id

    if (!targetUserId) {
      return 0
    }

    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)

    if (error) {
      throw new Error(`Failed to get user favorites count: ${error.message}`)
    }

    return count || 0
  }
}