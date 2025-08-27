export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'
export type TaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA'

export interface Task {
  id: string
  titulo: string
  descricao: string
  status: TaskStatus
  prioridade: TaskPriority
  data_vencimento: string | undefined
  created_at: string
  updated_at: string
  usuario_id: string,
  ordem?: number
}

export interface TaskCreate {
  titulo: string
  descricao: string
  status: TaskStatus
  prioridade: TaskPriority
  data_vencimento: string | undefined
  ordem?: number
}

export interface TaskUpdate {
  titulo?: string
  descricao?: string
  status?: TaskStatus
  prioridade?: TaskPriority
  data_vencimento?: string | undefined
  ordem?: number
}

export interface PaginatedResponse<T> {
  total: number
  data: T[]
}

export interface SingleResponse<T> {
  data: T[]
}

export interface TaskFilters {
  status?: TaskStatus
  prioridade?: TaskPriority
  search?: string
  skip?: number
  limit?: number
  data_criacao?: string
  data_atualizacao?: string
  data_vencimento?: string
} 