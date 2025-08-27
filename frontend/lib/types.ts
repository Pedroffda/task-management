// Tipos TypeScript para o sistema de gerenciamento de tarefas

export interface User {
    id: number
    name: string
    email: string
    password: string // Nota: não será exibido na interface
    creation_date: string
    update_date: string
  }
  
  export interface Task {
    id: number
    title: string
    description: string
    status: "PENDING" | "COMPLETED"
    priority: "LOW" | "MEDIUM" | "HIGH" // Corrigido erro de digitação de 'MEDIA' para 'MEDIUM'
    due_date: string | null
    creation_date: string
    update_date: string
    user_id: number,
    order: number
  }
  
  // Tipos específicos da interface
  export type TaskStatus = "PENDING" | "COMPLETED"
  export type TaskPriority = "LOW" | "MEDIUM" | "HIGH"
  
  export interface TaskFilters {
    status: "ALL" | TaskStatus
    priority: "ALL" | TaskPriority
    search: string
  }
  