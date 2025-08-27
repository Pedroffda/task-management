// Tipos TypeScript para o sistema de gerenciamento de tarefas

export interface User {
    id: string
    name: string
    email: string
    password?: string
    created_at?: string
    updated_at?: string
  }
  
  export interface Task {
    id: string
    titulo: string
    descricao: string
    status: "PENDENTE" | "CONCLUIDA"
    prioridade: "BAIXA" | "MEDIA" | "ALTA"
    data_vencimento: string | null
    created_at: string
    updated_at: string
    usuario_id: string,
    ordem: number
  }
  
  // Tipos específicos da interface
  export type TaskStatus = "PENDENTE" | "CONCLUIDA"
  export type TaskPriority = "BAIXA" | "MEDIA" | "ALTA"
  
  export interface TaskFilters {
    status: "PENDENTE" | "CONCLUIDA"
    prioridade: "BAIXA" | "MEDIA" | "ALTA"
    search: string
  }
  