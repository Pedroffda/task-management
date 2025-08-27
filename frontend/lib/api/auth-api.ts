import { API_BASE_URL, API_ENDPOINTS } from '../api-config'
import { ApiError } from './api-errors'

interface TokenResponse {
  access_token: string
  token_type: string
}

interface ApiUser {
  id: string
  nome: string
  email: string
}

class AuthAPI {
  private baseURL = API_BASE_URL

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const isFormData = typeof window !== 'undefined' && options.body instanceof FormData

    const config: RequestInit = {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    }

    // Adicionar token de autenticação se disponível
    const token = this.getStoredToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw ApiError.fromResponse(response, errorData)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      // Primeiro verificar localStorage, depois cookies
      const localToken = localStorage.getItem('access_token')
      if (localToken) return localToken
      
      // Verificar cookies
      const cookies = document.cookie.split(';')
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='))
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1]
        // Sincronizar com localStorage
        localStorage.setItem('access_token', token)
        return token
      }
    }
    return null
  }

  // Public getter for interceptors and external access
  getToken(): string | null {
    return this.getStoredToken()
  }

  private setStoredToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  private removeStoredToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  async login(email: string, password: string): Promise<ApiUser> {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    const token = await this.request<TokenResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: formData,
    })

    this.setStoredToken(token.access_token)

    // Buscar dados do usuário logado
    const user = await this.getCurrentUser()

    return user
  }

  async register(name: string, email: string, password: string): Promise<ApiUser> {
    // Backend espera campos: nome, email, senha
    const userData = {
      nome: name,
      email,
      senha: password,
    }



    const createdUser = await this.request<ApiUser>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    )

    return createdUser
  }

  async getCurrentUser(): Promise<ApiUser> {
    return await this.request<ApiUser>(API_ENDPOINTS.AUTH.ME)
  }

  async refreshToken(): Promise<void> {
    try {
      const response = await this.request<TokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { method: 'POST' }
      )
      this.setStoredToken(response.access_token)
    } catch (error) {
      this.logout()
      throw error
    }
  }

  logout(): void {
    this.removeStoredToken()
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }
}

export const authAPI = new AuthAPI() 