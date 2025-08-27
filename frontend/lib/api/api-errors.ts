export class ApiError extends Error {
  public status: number
  public code?: string
  public details?: Record<string, unknown>

  constructor(message: string, status: number, code?: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  static fromResponse(response: Response, errorData?: Record<string, unknown>): ApiError {
    const status = response.status
    let message = 'Erro desconhecido'
    let code: string | undefined

    if (errorData) {
      // Priorizar mensagens específicas da API
      if (typeof errorData.error === 'string') {
        message = errorData.error
      } else if (typeof errorData.detail === 'string') {
        message = errorData.detail
      } else if (typeof errorData.message === 'string') {
        message = errorData.message
      }

      // Capturar código de erro se disponível
      if (typeof errorData.code === 'string') {
        code = errorData.code
      }
    }

    // Mensagens padrão para códigos de status HTTP comuns
    if (!errorData || (!errorData.error && !errorData.detail && !errorData.message)) {
      switch (status) {
        case 400:
          message = 'Dados inválidos fornecidos'
          break
        case 401:
          message = 'Não autorizado. Faça login novamente'
          break
        case 403:
          message = 'Acesso negado'
          break
        case 404:
          message = 'Recurso não encontrado'
          break
        case 409:
          message = 'Conflito - recurso já existe'
          break
        case 422:
          message = 'Dados de validação inválidos'
          break
        case 500:
          message = 'Erro interno do servidor'
          break
        default:
          message = `Erro ${status}: ${response.statusText}`
      }
    }

    return new ApiError(message, status, code, errorData)
  }

  // Método para verificar se é um erro específico
  isConflict(): boolean {
    return this.status === 409
  }

  isValidationError(): boolean {
    return this.status === 422
  }

  isUnauthorized(): boolean {
    return this.status === 401
  }

  isForbidden(): boolean {
    return this.status === 403
  }

  isNotFound(): boolean {
    return this.status === 404
  }

  isServerError(): boolean {
    return this.status >= 500
  }
} 