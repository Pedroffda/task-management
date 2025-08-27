// Tipos TypeScript para o sistema de gerenciamento de tarefas

export interface User {
    id: string
    name: string
    email: string
    password?: string
    creation_date?: string
    update_date?: string
  }
  
  export interface Task {
    id: string
    title: string
    description: string
    status: "PENDING" | "COMPLETED"
    priority: "LOW" | "MEDIUM" | "HIGH"
    due_date: string | null
    creation_date: string
    update_date: string
    user_id: string,
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
  