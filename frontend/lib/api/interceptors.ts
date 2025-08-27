import { authAPI } from './auth-api'

// Interceptor para lidar com tokens expirados
export function setupAuthInterceptor() {
  // Interceptar todas as requisições fetch
  const originalFetch = window.fetch
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init)
    
    // Se receber 401 (Unauthorized), tentar renovar o token
    if (response.status === 401) {
      try {
        await authAPI.refreshToken()
        
        // Reenviar a requisição original com o novo token
        const newInit: RequestInit = { ...(init || {}) }
        const token = authAPI.getToken()
        if (token) {
          newInit.headers = {
            ...(newInit.headers || {}),
            Authorization: `Bearer ${token}`,
          }
        }
        
        return originalFetch(input, newInit)
      } catch (error) {
        // Se falhar ao renovar, fazer logout
        authAPI.logout()
        window.location.href = '/login'
        throw error
      }
    }
    
    return response
  }
} 