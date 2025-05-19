import { type CookieOptions } from '@supabase/ssr'

export type SupabaseCookieOptions = {
  name: string
  value: string
  options: CookieOptions
}
