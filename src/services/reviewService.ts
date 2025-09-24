import { supabase, type Tables } from '@/lib/supabase'

export type Review = Tables<'reviews'>
export type ReviewInsert = {
  business_id: string
  rating: number
  comment?: string
}

export class ReviewService {
  // Get all reviews for a business
  static async getReviewsForBusiness(businessId: string, options?: {
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`)
    }

    return data
  }

  // Get all reviews by a user
  static async getReviewsByUser(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        businesses (
          id,
          name,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user reviews: ${error.message}`)
    }

    return data
  }

  // Create a new review
  static async createReview(review: ReviewInsert) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated to create a review')
    }

    // Check if user already reviewed this business
    const existingReview = await this.getUserReviewForBusiness(review.business_id)
    if (existingReview) {
      throw new Error('You have already reviewed this business')
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        user_id: user.id
      } as any)
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`)
    }

    return data
  }

  // Update a review
  static async updateReview(id: string, updates: Partial<ReviewInsert>) {
    // @ts-ignore - Temporary workaround for Supabase types
    const { data, error } = await supabase
      .from('reviews')
      // @ts-ignore
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      throw new Error(`Failed to update review: ${error.message}`)
    }

    return data
  }

  // Delete a review
  static async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete review: ${error.message}`)
    }
  }

  // Get user's review for a specific business
  static async getUserReviewForBusiness(businessId: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user review: ${error.message}`)
    }

    return data
  }

  // Get review statistics for a business
  static async getReviewStats(businessId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('business_id', businessId)

    if (error) {
      throw new Error(`Failed to fetch review stats: ${error.message}`)
    }

    if (data.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }

    const totalReviews = data.length
    const averageRating = (data as any[]).reduce((sum, review) => sum + review.rating, 0) / totalReviews

    const ratingDistribution = (data as any[]).reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++
      return dist
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution
    }
  }
}