import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // This will surface clearly in the console during development
  // so you remember to set the env vars.
  console.warn('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

