import { api } from './api'

export interface TopUpResponse {
  paymentId: string
  provider: string
  providerRef: string
  clientSecret: string
  status: string
  manualConfirm: boolean
}

export async function createTopUp(accountId: string, amount: number): Promise<TopUpResponse> {
  const { data } = await api.post<TopUpResponse>('/api/v1/payments/top-up', { accountId, amount })
  return data
}

export async function confirmTopUp(paymentId: string): Promise<void> {
  await api.post(`/api/v1/payments/${paymentId}/confirm`, {})
}
