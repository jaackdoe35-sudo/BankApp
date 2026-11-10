import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, type UpdateProfilePayload } from '../lib/api'
import { apiErrorMessage } from '../lib/errors'
import AppLayout from '../components/AppLayout'

const KYC_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  VERIFIED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState<UpdateProfilePayload>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
    addressLine1: user?.addressLine1 ?? '',
    city: user?.city ?? '',
    country: user?.country ?? '',
    dateOfBirth: user?.dateOfBirth ?? '',
  })
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [saving, setSaving] = useState(false)

  if (!user) return null
  const set = (k: keyof UpdateProfilePayload) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      // Drop empty strings so optional fields stay null.
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== ''),
      ) as UpdateProfilePayload
      await updateProfile(payload)
      await refreshUser()
      setStatus({ kind: 'ok', msg: 'Profile saved.' })
    } catch (err) {
      setStatus({ kind: 'err', msg: apiErrorMessage(err, 'Save failed') })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Account</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${KYC_STYLES[user.kycStatus]}`}>
              KYC: {user.kycStatus}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-slate-400">Role</dt>
            <dd>{user.role}</dd>
            <dt className="text-slate-400">User ID</dt>
            <dd className="truncate font-mono text-xs">{user.userId}</dd>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <form onSubmit={onSave} className="mt-4 grid grid-cols-2 gap-4">
            <Input label="First name" value={form.firstName ?? ''} onChange={set('firstName')} />
            <Input label="Last name" value={form.lastName ?? ''} onChange={set('lastName')} />
            <Input label="Date of birth" type="date" value={form.dateOfBirth ?? ''} onChange={set('dateOfBirth')} />
            <Input label="Phone" value={form.phone ?? ''} onChange={set('phone')} />
            <Input label="Address" value={form.addressLine1 ?? ''} onChange={set('addressLine1')} />
            <Input label="City" value={form.city ?? ''} onChange={set('city')} />
            <Input label="Country" value={form.country ?? ''} onChange={set('country')} />
            <div className="col-span-2 flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {status && (
                <span className={status.kind === 'ok' ? 'text-sm text-green-600' : 'text-sm text-red-600'}>
                  {status.msg}
                </span>
              )}
            </div>
          </form>
        </section>
      </div>
    </AppLayout>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      />
    </label>
  )
}
