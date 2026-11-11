export type ActivityUpload = { id: string; remoteId?: string; name: string; size: number; type: string; createdAt: string }
export type ActivityEvent = { id: string; experimentId: string; type: string; createdAt: string; snapshot: Record<string, unknown>; backendVerified: boolean; [key: string]: unknown }
const STORAGE = 'bankapp.experiment.events.v1'
const CHANNEL = 'bankapp-experiments'
const DB = 'northstar-activity-files'
const STORE = 'uploads'
const SESSION_KEY = 'bankapp.experiment.remote-session.v1'
const API_BASE = (import.meta.env.VITE_ACTIVITY_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

type RemoteSession = { sessionId: string; sessionToken: string; expiresAt: string }
let remoteSessionPromise: Promise<RemoteSession | null> | null = null

async function getRemoteSession(): Promise<RemoteSession | null> {
  if (!API_BASE) return null
  try {
    const cached = sessionStorage.getItem(SESSION_KEY)
    if (cached) {
      const session = JSON.parse(cached) as RemoteSession
      if (session.expiresAt && new Date(session.expiresAt).getTime() > Date.now() + 60_000) return session
    }
  } catch { sessionStorage.removeItem(SESSION_KEY) }
  if (!remoteSessionPromise) {
    remoteSessionPromise = fetch(`${API_BASE}/api/v1/experiment/sessions`, { method: 'POST', headers: { Accept: 'application/json' } })
      .then(async response => {
        if (!response.ok) throw new Error(`Activity session failed: ${response.status}`)
        const session = await response.json() as RemoteSession
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
        return session
      })
      .catch(() => null)
      .finally(() => { remoteSessionPromise = null })
  }
  return remoteSessionPromise
}

async function sendRemoteEvent(event: ActivityEvent): Promise<boolean> {
  const session = await getRemoteSession()
  if (!session) return false
  try {
    const response = await fetch(`${API_BASE}/api/v1/experiment/sessions/${session.sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Experiment-Token': session.sessionToken },
      body: JSON.stringify({ eventType: event.type, payload: event }),
    })
    if (response.status === 401) sessionStorage.removeItem(SESSION_KEY)
    return response.ok
  } catch { return false }
}

async function sendRemoteFile(file: File): Promise<string | undefined> {
  const session = await getRemoteSession()
  if (!session) return undefined
  try {
    const form = new FormData()
    form.append('file', file, file.name)
    const response = await fetch(`${API_BASE}/api/v1/experiment/sessions/${session.sessionId}/uploads`, {
      method: 'POST', headers: { 'X-Experiment-Token': session.sessionToken }, body: form,
    })
    if (response.status === 401) sessionStorage.removeItem(SESSION_KEY)
    if (!response.ok) return undefined
    const result = await response.json() as { id: string }
    return result.id
  } catch { return undefined }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1)
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' }) }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
export async function storeActivityFile(file: File): Promise<ActivityUpload> {
  const id = crypto.randomUUID()
  const meta = { id, name: file.name.slice(0, 180), size: file.size, type: file.type || 'application/octet-stream', createdAt: new Date().toISOString() }
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put({ ...meta, blob: file })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
  db.close()
  const allowed = new Set(['image/jpeg','image/png','image/webp','application/pdf','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
  const extensionAllowed = /\\.(jpe?g|png|webp|pdf|txt|docx?)$/i.test(file.name)
  const remoteId = allowed.has(file.type) && extensionAllowed && file.size <= 10 * 1024 * 1024
    ? await sendRemoteFile(file) : undefined
  return { ...meta, ...(remoteId ? { remoteId } : {}) }
}
export async function readActivityFile(id: string): Promise<{ name: string; type: string; blob: Blob } | null> {
  const db = await openDb()
  const value = await new Promise<{ name: string; type: string; blob: Blob } | undefined>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  db.close()
  return value || null
}
export function recordActivity(event: ActivityEvent): boolean {
  let events: ActivityEvent[] = []
  try {
    const previous = JSON.parse(localStorage.getItem(STORAGE) || '[]')
    events = Array.isArray(previous) ? previous : []
  } catch { events = [] }
  let locallyStored = true
  try { localStorage.setItem(STORAGE, JSON.stringify([...events, event])) }
  catch { locallyStored = false }
  try { const channel = new BroadcastChannel(CHANNEL); channel.postMessage({ type: 'event', event }); channel.close() } catch {}
  void sendRemoteEvent(event)
  return locallyStored
}
