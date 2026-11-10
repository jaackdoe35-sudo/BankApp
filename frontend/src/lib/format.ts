/** Format a numeric/string amount as currency (defaults to USD). */
export function formatMoney(amount: number | string, currency = 'USD'): string {
  const value = typeof amount === 'string' ? Number(amount) : amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString()
}
