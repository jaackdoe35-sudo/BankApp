export type ActivityUpload = { id: string; name: string; size: number; type: string; createdAt: string }
export type ActivityEvent = { id: string; experimentId: string; type: string; createdAt: string; snapshot: Record<string, unknown>; backendVerified: boolean; [key: string]: unknown }
const STORAGE = 'bankapp.experiment.events.v1'
const CHANNEL = 'bankapp-experiments'
const DB = 'northstar-activity-files'
const STORE = 'uploads'
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
  return meta
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
export function recordActivity(event: ActivityEvent) {
  try {
    const previous = JSON.parse(localStorage.getItem(STORAGE) || '[]')
    const events = Array.isArray(previous) ? previous : []
    localStorage.setItem(STORAGE, JSON.stringify([...events, event]))
  } catch {
    localStorage.setItem(STORAGE, JSON.stringify([event]))
  }
  try { const channel = new BroadcastChannel(CHANNEL); channel.postMessage({ type: 'event', event }); channel.close() } catch {}
}
