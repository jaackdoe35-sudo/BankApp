export type ActivityUpload = { id: string; remoteId?: string; name: string; size: number; type: string; createdAt: string }
export type ActivityEvent = { id: string; experimentId: string; type: string; createdAt: string; snapshot: Record<string, unknown>; backendVerified: boolean; [key: string]: unknown }
const STORAGE = 'bankapp.experiment.events.v1'
const CHANNEL = 'bankapp-experiments'
const DB = 'northstar-activity-files'
const STORE = 'uploads'
const SESSION_KEY = 'bankapp.experiment.remote-session.v1'
const PENDING_KEY = 'bankapp.experiment.remote-pending.v1'
const API_BASE = (import.meta.env.VITE_ACTIVITY_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
export const isRemoteActivityConfigured = Boolean(API_BASE)

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
      body: JSON.stringify({ eventType: event.type, payload: sanitizeActivityEvent(event) }),
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

const SENSITIVE_KEYS = new Set([
  'password','passwd','token','accesstoken','refreshtoken','authorization','cookie',
  'code','codevalue','verificationcode','otp','otpcode','onetimepassword','secret',
  'clientsecret','jwt','pin','cvv','securitycode','mfacode','passcode','passwordconfirmation',\n  'privatekey','apikey','accesskey','sessiontoken','experimenttoken','credential','credentials',\n  'passphrase','bearer','recoverycode','totp',
])
const normalizeKey = (key: string) => key.replace(/[^a-z]/gi, '').toLowerCase()
function redactActivityValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactActivityValue)
  if (!value || typeof value !== 'object') return value
  const source = value as Record<string, unknown>
  const sensitiveField = typeof source.field === 'string' && SENSITIVE_KEYS.has(normalizeKey(source.field))
  const safe: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(source)) {
    const normalized = normalizeKey(key)
    if (SENSITIVE_KEYS.has(normalized) || (sensitiveField && normalized === 'value')) continue
    safe[key] = redactActivityValue(child)
  }
  return safe
}
function sanitizeActivityEvent(event: ActivityEvent): ActivityEvent {
  return redactActivityValue(event) as ActivityEvent
}

let pendingFlush: Promise<void> | null = null

function readPendingEvents(): ActivityEvent[] {
  try {
    const value = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]')
    return Array.isArray(value) ? value.filter((item): item is ActivityEvent => !!item && typeof item.id === 'string').map(sanitizeActivityEvent) : []
  } catch { return [] }
}

function queueRemoteEvent(event: ActivityEvent): void {
  try {
    const pending = readPendingEvents()
    if (!pending.some(item => item.id === event.id)) {
      pending.push(event)
      localStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    }
  } catch { /* The direct delivery attempt below still runs if browser storage is unavailable. */ }
}

export function flushPendingActivityEvents(): Promise<void> {
  if (!API_BASE) return Promise.resolve()
  if (pendingFlush) return pendingFlush
  pendingFlush = (async () => {
    const successful = new Set<string>()
    for (const event of readPendingEvents()) {
      if (await sendRemoteEvent(event)) successful.add(event.id)
      else break
    }
    if (successful.size) {
      try {
        const latest = readPendingEvents().filter(event => !successful.has(event.id))
        localStorage.setItem(PENDING_KEY, JSON.stringify(latest))
      } catch { /* Retain the queue when storage is unavailable. */ }
    }
  })().finally(() => { pendingFlush = null })
  return pendingFlush
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { void flushPendingActivityEvents() })
  void flushPendingActivityEvents()
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
  const meta = { id, name: file.name.slice(0, 180), size: file.size, type: contentType, createdAt: new Date().toISOString() }
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
  const extensionTypes: Record<string, string> = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp', pdf:'application/pdf', txt:'text/plain', doc:'application/msword', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const contentType = file.type || extensionTypes[extension] || 'application/octet-stream'
  const extensionAllowed = Object.hasOwn(extensionTypes, extension)
  const validForRemote = allowed.has(contentType) && extensionAllowed && file.size > 0 && file.size <= 10 * 1024 * 1024
  const uploadFile = !file.type && validForRemote ? new File([file], file.name, { type: contentType }) : file
  const remoteId = validForRemote ? await sendRemoteFile(uploadFile) : undefined
  if (API_BASE && validForRemote && !remoteId) {
    throw new Error('Evidence upload did not reach the remote Activity Ledger. Check the backend connection and try again.')
  }
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
export function recordActivity(event: ActivityEvent): boolean {\n  const safeEvent = sanitizeActivityEvent(event);
  let events: ActivityEvent[] = []
  try {
    const previous = JSON.parse(localStorage.getItem(STORAGE) || '[]')
    events = Array.isArray(previous) ? previous.filter((item): item is ActivityEvent => !!item && typeof item.id === 'string').map(sanitizeActivityEvent) : []
  } catch { events = [] }
  let locallyStored = true
  try { localStorage.setItem(STORAGE, JSON.stringify([...events, safeEvent])) }
  catch { locallyStored = false }
  try { const channel = new BroadcastChannel(CHANNEL); channel.postMessage({ type: 'event', event: safeEvent }); channel.close() } catch {}
  queueRemoteEvent(safeEvent)
  void flushPendingActivityEvents()
  return locallyStored
}
