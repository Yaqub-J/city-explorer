import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  notificationsService,
  type Notification,
  type NotificationType
} from '@/services/notificationsService'

interface UseNotificationsOptions {
  limit?: number
  unreadOnly?: boolean
  type?: NotificationType
  autoSubscribe?: boolean
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    limit = 50,
    unreadOnly = false,
    type,
    autoSubscribe = true
  } = options

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const [notificationsData, unreadCountData] = await Promise.all([
        notificationsService.getUserNotifications(user.id, {
          limit,
          unreadOnly,
          type
        }),
        notificationsService.getUnreadCount(user.id)
      ])

      setNotifications(notificationsData)
      setUnreadCount(unreadCountData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(message)
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [user, limit, unreadOnly, type])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    const success = await notificationsService.markAsRead(notificationId)
    if (success) {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return

    const success = await notificationsService.markAllAsRead(user.id)
    if (success) {
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
      setUnreadCount(0)
    }
  }, [user])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    const success = await notificationsService.deleteNotification(notificationId)
    if (success) {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )

      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId)
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  }, [notifications])

  // Handle new notification from real-time subscription
  const handleNewNotification = useCallback((newNotification: Notification) => {
    setNotifications(prev => {
      // Avoid duplicates
      if (prev.some(n => n.id === newNotification.id)) {
        return prev
      }
      return [newNotification, ...prev].slice(0, limit)
    })

    if (!newNotification.read) {
      setUnreadCount(prev => prev + 1)
    }

    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      notificationsService.showBrowserNotification(
        newNotification.title,
        {
          body: newNotification.message,
          tag: newNotification.id,
          requireInteraction: false,
          silent: false
        }
      )
    }
  }, [limit])

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !autoSubscribe) return

    fetchNotifications()

    const unsubscribe = notificationsService.subscribeToNotifications(
      user.id,
      handleNewNotification
    )

    return () => {
      unsubscribe()
    }
  }, [user, autoSubscribe, fetchNotifications, handleNewNotification])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  }
}

// Specialized hook for unread notifications
export function useUnreadNotifications() {
  return useNotifications({
    unreadOnly: true,
    limit: 20,
    autoSubscribe: true
  })
}

// Hook for notification permission management
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission
    }
    return 'default'
  })

  const requestPermission = useCallback(async () => {
    const granted = await notificationsService.requestNotificationPermission()
    setPermission(granted ? 'granted' : 'denied')
    return granted
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  return {
    permission,
    requestPermission,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied'
  }
}

// Hook for creating notifications (for admin/business users)
export function useCreateNotification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createNotification = useCallback(async (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
    expiresAt?: string
  ) => {
    try {
      setLoading(true)
      setError(null)

      const notification = await notificationsService.createNotification({
        user_id: userId,
        type,
        title,
        message,
        data,
        expires_at: expiresAt
      })

      return notification
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create notification'
      setError(message)
      console.error('Error creating notification:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createBulkNotifications = useCallback(async (
    notifications: Array<{
      userId: string
      type: NotificationType
      title: string
      message: string
      data?: Record<string, any>
      expiresAt?: string
    }>
  ) => {
    try {
      setLoading(true)
      setError(null)

      const payload = notifications.map(n => ({
        user_id: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        expires_at: n.expiresAt
      }))

      await notificationsService.createBulkNotifications(payload)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create notifications'
      setError(message)
      console.error('Error creating bulk notifications:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createNotification,
    createBulkNotifications,
    loading,
    error
  }
}