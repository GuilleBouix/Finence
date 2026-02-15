import { createClient } from '@supabase/supabase-js'

// Obtenemos las variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

/**
 * Instancia global del cliente de Supabase
 * Se usa en toda la aplicación para:
 * - Autenticación (signIn, signOut, OAuth, etc.)
 * - Consultas a la base de datos (select, insert, update, delete)
 * - Gestión de sesiones
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)