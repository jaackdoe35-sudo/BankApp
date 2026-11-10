import { AxiosError } from 'axios'

interface ApiErrorBody {
  message?: string
  violations?: { field: string; message: string }[]
}

/** Pull a human-friendly message out of an API/Axios error. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.violations?.length) {
      return body.violations.map((v) => `${v.field}: ${v.message}`).join(', ')
    }
    if (body?.message) return body.message
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}
