export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
  },
  TASKS: {
    LIST: '/api/v1/tarefas',
    CREATE: '/api/v1/tarefas',
    UPDATE: '/api/v1/tarefas/{id}',
    DELETE: '/api/v1/tarefas/{id}',
  },
} as const 