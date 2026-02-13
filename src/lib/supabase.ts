import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper para convertir snake_case a camelCase
export function toCamelCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v)) as any
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/([-_][a-z])/g, group =>
          group.toUpperCase().replace('-', '').replace('_', '')
        )]: toCamelCase(obj[key]),
      }),
      {}
    ) as T
  }
  return obj
}

// Helper para convertir camelCase a snake_case
export function toSnakeCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v)) as any
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`)]: toSnakeCase(obj[key]),
      }),
      {}
    ) as T
  }
  return obj
}
