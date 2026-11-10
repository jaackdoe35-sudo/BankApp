import { api } from './api'

export type LoanStatus = 'PENDING' | 'REJECTED' | 'ACTIVE' | 'PAID_OFF'
export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE'

export interface Loan {
  id: string
  accountId: string
  principal: string
  annualRate: string
  termMonths: number
  status: LoanStatus
  outstanding: string
  nextDueDate: string | null
  createdAt: string
}

export interface Installment {
  seq: number
  dueDate: string
  principalDue: string
  interestDue: string
  totalDue: string
  status: InstallmentStatus
}

export interface LoanDetail {
  loan: Loan
  schedule: Installment[]
}

export async function listLoans(): Promise<Loan[]> {
  const { data } = await api.get<Loan[]>('/api/v1/loans')
  return data
}

export async function getLoan(id: string): Promise<LoanDetail> {
  const { data } = await api.get<LoanDetail>(`/api/v1/loans/${id}`)
  return data
}

export async function applyForLoan(accountId: string, principal: number, termMonths: number): Promise<Loan> {
  const { data } = await api.post<Loan>('/api/v1/loans', { accountId, principal, termMonths })
  return data
}

export async function repayLoan(id: string): Promise<LoanDetail> {
  const { data } = await api.post<LoanDetail>(`/api/v1/loans/${id}/repay`, {})
  return data
}

// ---- Admin ----
export async function listAdminLoans(status?: LoanStatus): Promise<Loan[]> {
  const { data } = await api.get<Loan[]>('/api/v1/admin/loans', { params: status ? { status } : {} })
  return data
}

export async function approveLoan(id: string): Promise<LoanDetail> {
  const { data } = await api.post<LoanDetail>(`/api/v1/admin/loans/${id}/approve`, {})
  return data
}

export async function rejectLoan(id: string): Promise<Loan> {
  const { data } = await api.post<Loan>(`/api/v1/admin/loans/${id}/reject`, {})
  return data
}
