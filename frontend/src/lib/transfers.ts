import { api } from './api'

export interface Beneficiary {
  id: string
  nickname: string
  accountNumber: string
  createdAt: string
}

export interface TransferResult {
  reference: string
  sourceAccountId: string
  destinationAccountNumber: string
  amount: string
  sourceBalanceAfter: string
  status: string
  createdAt: string
}

export interface TransferInput {
  sourceAccountId: string
  destinationAccountNumber: string
  amount: number
  note?: string
}

export async function createTransfer(input: TransferInput): Promise<TransferResult> {
  // A fresh idempotency key per submission makes retries of THIS intent safe
  // (the server posts at most once for a given key).
  const { data } = await api.post<TransferResult>('/api/v1/transfers', input, {
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  })
  return data
}

export async function listBeneficiaries(): Promise<Beneficiary[]> {
  const { data } = await api.get<Beneficiary[]>('/api/v1/beneficiaries')
  return data
}

export async function addBeneficiary(nickname: string, accountNumber: string): Promise<Beneficiary> {
  const { data } = await api.post<Beneficiary>('/api/v1/beneficiaries', { nickname, accountNumber })
  return data
}

export async function deleteBeneficiary(id: string): Promise<void> {
  await api.delete(`/api/v1/beneficiaries/${id}`)
}
