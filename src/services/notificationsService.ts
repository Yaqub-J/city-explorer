import { supabase } from '@/lib/supabase'

export type NotificationType =
  | 'new_review'
  | 'new_favorite'
  | 'event_reminder'
  | 'business_update'
  | 'recommendation'
  | 'booking_confirmation'
  | 'trending_place'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  created_at: string
  expires_at?: string
}

export interface CreateNotificationPayload {
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  expires_at?: string
}

class NotificationsService {
  private subscriptions = new Map<string, () => void>()

  // Create a new notification
  async createNotification(payload: CreateNotificationPayload): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...payload,
          read: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating notification:', error)
      return null
    }
  }

  // Get notifications for a user
  async getUserNotifications(
    userId: string,
    options: {
      limit?: number
      unreadOnly?: boolean
      type?: NotificationType
    } = {}
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (options.unreadOnly) {
        query = query.eq('read', false)
      }

      if (options.type) {
        query = query.eq('type', options.type)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error

      // Filter out expired notifications
      const now = new Date()
      const validNotifications = (data || []).filter(notification => {
        if (!notification.expires_at) return true
        return new Date(notification.expires_at) > now
      })

      return validNotifications
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      return false
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): () => void {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()

    const unsubscribe = () => {
      supabase.removeChannel(channel)
      this.subscriptions.delete(userId)
    }

    this.subscriptions.set(userId, unsubscribe)
    return unsubscribe
  }

  // Unsubscribe from notifications
  unsubscribeFromNotifications(userId: string): void {
    const unsubscribe = this.subscriptions.get(userId)
    if (unsubscribe) {
      unsubscribe()
    }
  }

  // Clean up expired notifications
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('expires_at', new Date().toISOString())

      if (error) throw error
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error)
    }
  }

  // Predefined notification creators
  async notifyNewReview(
    businessOwnerId: string,
    reviewerName: string,
    businessName: string,
    rating: number
  ): Promise<void> {
    await this.createNotification({
      user_id: businessOwnerId,
      type: 'new_review',
      title: 'New Review Received',
      message: `${reviewerName} left a ${rating}-star review for ${businessName}`,
      data: { rating, reviewerName, businessName }
    })
  }

  async notifyEventReminder(
    userId: string,
    eventTitle: string,
    eventDate: string,
    hoursUntil: number
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'event_reminder',
      title: 'Event Reminder',
      message: `${eventTitle} starts in ${hoursUntil} hours`,
      data: { eventTitle, eventDate, hoursUntil },
      expires_at: eventDate
    })
  }

  async notifyBusinessUpdate(
    followerId: string,
    businessName: string,
    updateType: string,
    updateDetails: string
  ): Promise<void> {
    await this.createNotification({
      user_id: followerId,
      type: 'business_update',
      title: `${businessName} Update`,
      message: updateDetails,
      data: { businessName, updateType }
    })
  }

  async notifyRecommendation(
    userId: string,
    placeName: string,
    reason: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'recommendation',
      title: 'New Recommendation',
      message: `We found ${placeName} for you - ${reason}`,
      data: { placeName, reason }
    })
  }

  async notifyBookingConfirmation(
    userId: string,
    businessName: string,
    bookingDate: string,
    bookingTime: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'booking_confirmation',
      title: 'Booking Confirmed',
      message: `Your booking at ${businessName} for ${bookingDate} at ${bookingTime} is confirmed`,
      data: { businessName, bookingDate, bookingTime }
    })
  }

  async notifyTrendingPlace(
    userId: string,
    placeName: string,
    trendReason: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'trending_place',
      title: 'Trending Near You',
      message: `${placeName} is trending - ${trendReason}`,
      data: { placeName, trendReason },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    })
  }

  // Batch create notifications
  async createBulkNotifications(notifications: CreateNotificationPayload[]): Promise<void> {
    try {
      const payload = notifications.map(notification => ({
        ...notification,
        read: false,
        created_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('notifications')
        .insert(payload)

      if (error) throw error
    } catch (error) {
      console.error('Error creating bulk notifications:', error)
    }
  }

  // Request permission for browser notifications
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // Show browser notification
  async showBrowserNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    const hasPermission = await this.requestNotificationPermission()

    if (hasPermission) {
      new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options
      })
    }
  }
}

export const notificationsService = new NotificationsService()
export default notificationsService