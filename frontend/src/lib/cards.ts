import { api } from './api'

export type CardStatus = 'ACTIVE' | 'FROZEN' | 'CANCELLED'

export interface Card {
  id: string
  accountId: string
  last4: string
  brand: string
  expMonth: number
  expYear: number
  status: CardStatus
  monthlyLimit: string
  createdAt: string
}

export interface IssuedCard {
  card: Card
  cardNumber: string
}

export interface CardChargeResult {
  reference: string
  merchant: string
  amount: string
  accountBalanceAfter: string
}

export async function listCards(): Promise<Card[]> {
  const { data } = await api.get<Card[]>('/api/v1/cards')
  return data
}

export async function issueCard(accountId: string, monthlyLimit: number): Promise<IssuedCard> {
  const { data } = await api.post<IssuedCard>('/api/v1/cards', { accountId, monthlyLimit })
  return data
}

export async function freezeCard(id: string): Promise<Card> {
  const { data } = await api.post<Card>(`/api/v1/cards/${id}/freeze`, {})
  return data
}

export async function unfreezeCard(id: string): Promise<Card> {
  const { data } = await api.post<Card>(`/api/v1/cards/${id}/unfreeze`, {})
  return data
}

export async function cancelCard(id: string): Promise<Card> {
  const { data } = await api.post<Card>(`/api/v1/cards/${id}/cancel`, {})
  return data
}

export async function payWithCard(id: string, merchant: string, amount: number): Promise<CardChargeResult> {
  const { data } = await api.post<CardChargeResult>(`/api/v1/cards/${id}/pay`, { merchant, amount })
  return data
}
