// Dados mock e gerenciamento de estado para o sistema de gerenciamento de tarefas
import type { User, Task } from "@/lib/types"

// Usuário mock atual (simulando autenticação)
export const mockUser: User = {
  id: "1",
  name: "João Silva",
  email: "joao@exemplo.com",
  password: "senha123",
  creation_date: new Date().toISOString(),
  update_date: new Date().toISOString(),
}

// Dados mock das tarefas
export const mockTasks: Task[] = [
  {
    id: '1',
    title: "Completar proposta do projeto",
    description: "Escrever e enviar a proposta do projeto Q4 para o novo cliente",
    status: "PENDING",
    priority: "HIGH", 
    due_date: "2024-12-15",
    creation_date: "2024-12-01T10:00:00Z",
    update_date: "2024-12-01T10:00:00Z",
    user_id: '1',
    order: 0,
  },
  {
    id: '2',
    title: "Revisar desempenho da equipe",
    description: "Conduzir revisões trimestrais de desempenho para todos os membros da equipe",
    status: "COMPLETED",
    priority: "MEDIUM",
    due_date: "2024-12-10",
    creation_date: "2024-11-25T09:00:00Z",
    update_date: "2024-12-05T14:30:00Z",
    user_id: '1',
    order: 0,
  },
  {
    id: '3',
    title: "Atualizar documentação",
    description: "Atualizar documentação da API com as últimas mudanças",
    status: "PENDING",
    priority: "LOW",
    due_date: null,
    creation_date: "2024-12-03T16:00:00Z",
    update_date: "2024-12-03T16:00:00Z",
    user_id: '1',
    order: 0,
  },
]

// Funções simples de gerenciamento de estado (em um app real, você usaria Context ou biblioteca de gerenciamento de estado)
let currentUser: User | null = null
const tasks: Task[] = [...mockTasks]

export const authService = {
  login: (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === mockUser.email && password === "senha123") {
          currentUser = mockUser
          resolve(mockUser)
        } else {
          resolve(null)
        }
      }, 500)
    })
  },

  register: (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: String(Date.now()),
          name,
          email,
          password,
          creation_date: new Date().toISOString(),
          update_date: new Date().toISOString(),
        }
        currentUser = newUser
        resolve(newUser)
      }, 500)
    })
  },

  logout: () => {
    currentUser = null
  },

  getCurrentUser: () => currentUser,
}

export const taskService = {
  getTasks: (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...tasks]), 200)
    })
  },

  createTask: (taskData: Omit<Task, "id" | "creation_date" | "update_date" | "user_id">): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          ...taskData,
          id: String(Date.now()),
          creation_date: new Date().toISOString(),
          update_date: new Date().toISOString(),
          // Para mock, usamos 1. Em produção, tasks virão do backend com user_id do token
          user_id: '1',
        }
        tasks.push(newTask)
        resolve(newTask)
      }, 300)
    })
  },

  updateTask: (id: number, updates: Partial<Task>): Promise<Task | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = tasks.findIndex((task) => task.id === id.toString())
        if (taskIndex !== -1) {
          tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            update_date: new Date().toISOString(),
          }
          resolve(tasks[taskIndex])
        } else {
          resolve(null)
        }
      }, 300)
    })
  },

  deleteTask: (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = tasks.findIndex((task) => task.id === id.toString())
        if (taskIndex !== -1) {
          tasks.splice(taskIndex, 1)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 200)
    })
  },

  reorderTasks: (reorderedTasks: Task[]): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update the tasks array with new order
        reorderedTasks.forEach((task, index) => {
          const taskIndex = tasks.findIndex((t) => t.id === task.id)
          if (taskIndex !== -1) {
            tasks[taskIndex] = {
              ...tasks[taskIndex],
              ...task,
              update_date: new Date().toISOString(),
            }
          }
        })
        resolve([...tasks])
      }, 200)
    })
  },
}
