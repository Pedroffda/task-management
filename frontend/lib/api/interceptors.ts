import { authAPI } from './auth-api'

// Interceptor para lidar com tokens expirados ou inválidos
export function setupAuthInterceptor() {
  // Interceptar todas as requisições fetch
  const originalFetch = window.fetch
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init)
    
    // Se receber 401 (Unauthorized), fazer logout imediatamente
    if (response.status === 401) {
      // Fazer logout e redirecionar para login
      authAPI.logout()
      // Remover cookie
      document.cookie = 'access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      window.location.href = '/login'
      throw new Error('Token expirado ou inválido')
    }
    
    return response
  }
} 