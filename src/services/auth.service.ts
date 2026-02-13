import { supabase } from '@/lib/supabase'

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'technician' | 'viewer'
  fullName: string | null
  phone: string | null
}

class AuthService {
  /**
   * Login con credenciales
   * NOTA: En producción, esto debería usar Supabase Auth.
   * Para el prototipo, validamos contra la tabla users directamente.
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Buscar usuario por username
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', credentials.username)
        .single()

      if (error || !user) {
        throw new Error('Usuario no encontrado')
      }

      // En producción, validar password_hash con bcrypt
      // Para prototipo, comparamos directamente (INSEGURO EN PRODUCCIÓN)
      if (credentials.password !== 'SinergIA') {
        throw new Error('Contraseña incorrecta')
      }

      // Guardar sesión en localStorage
      const sessionData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        phone: user.phone,
      }

      localStorage.setItem('auth_user', JSON.stringify(sessionData))
      localStorage.setItem('auth_token', user.id)

      return sessionData
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('auth_user')
    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch {
      return null
    }
  }

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  /**
   * Obtener token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}

export const authService = new AuthService()
