import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a time string deterministically for SSR + CSR.
 * Defaults to `hh:mm AM/PM` (hour12) with zero-padded hours/minutes.
 */
export function formatTime(date: Date | number = Date.now(), options?: Intl.DateTimeFormatOptions, locale?: string) {
  const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true, ...options }
  return new Date(date).toLocaleTimeString(locale || undefined, opts)
}
