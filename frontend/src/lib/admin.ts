import { api, type Profile } from './api'

export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'

export async function listAllUsers(): Promise<Profile[]> {
  const { data } = await api.get<Profile[]>('/api/v1/admin/users')
  return data
}

export async function setKyc(userId: string, status: KycStatus): Promise<Profile> {
  const { data } = await api.post<Profile>(`/api/v1/admin/users/${userId}/kyc`, { status })
  return data
}

export interface AuditEntry {
  id: string
  actorUserId: string | null
  action: string
  entityType: string
  entityId: string | null
  message: string
  createdAt: string
}

export async function listAudit(size = 50): Promise<AuditEntry[]> {
  const { data } = await api.get<AuditEntry[]>('/api/v1/admin/audit', { params: { size } })
  return data
}

export interface AdminAccount {
  accountNumber: string
  type: string
  balance: string
  currency: string
  status: string
  ownerEmail: string
}

export async function listAdminAccounts(): Promise<AdminAccount[]> {
  const { data } = await api.get<AdminAccount[]>('/api/v1/admin/accounts')
  return data
}

export async function tellerDeposit(accountNumber: string, amount: number): Promise<void> {
  await api.post('/api/v1/admin/accounts/deposit', { accountNumber, amount })
}
