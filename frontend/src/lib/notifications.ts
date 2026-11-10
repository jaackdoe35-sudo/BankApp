import { api } from './api'

export interface AppNotification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export async function listNotifications(): Promise<AppNotification[]> {
  const { data } = await api.get<AppNotification[]>('/api/v1/notifications')
  return data
}

export async function unreadCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>('/api/v1/notifications/unread-count')
  return data.count
}

export async function markRead(id: string): Promise<void> {
  await api.post(`/api/v1/notifications/${id}/read`, {})
}

export async function markAllRead(): Promise<void> {
  await api.post('/api/v1/notifications/read-all', {})
}
