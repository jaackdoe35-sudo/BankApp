import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { listNotifications, markAllRead, markRead } from '../lib/notifications'
import { formatDateTime } from '../lib/format'

export default function NotificationsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: listNotifications })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['notifications'] })
    qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
  }
  const readOne = useMutation({ mutationFn: (id: string) => markRead(id), onSuccess: invalidate })
  const readAll = useMutation({ mutationFn: markAllRead, onSuccess: invalidate })

  const items = data ?? []
  const hasUnread = items.some((n) => !n.read)

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <button
          onClick={() => readAll.mutate()}
          disabled={!hasUnread || readAll.isPending}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Mark all read
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {isLoading && <p className="text-slate-500">Loading…</p>}
        {!isLoading && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No notifications yet.
          </div>
        )}
        {items.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between rounded-2xl border p-4 ${
              n.read ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50/50'
            }`}
          >
            <div>
              <div className="font-medium">
                {!n.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />}
                {n.title}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
            </div>
            {!n.read && (
              <button
                onClick={() => readOne.mutate(n.id)}
                className="ml-4 shrink-0 text-sm text-slate-500 hover:text-slate-900"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
