import { API_BASE_URL, API_ENDPOINTS } from '../api-config'
import { Task, TaskCreate, TaskUpdate, PaginatedResponse, SingleResponse } from '../types/task'

class TaskService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('access_token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        throw new Error('Unauthorized access')
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getTasks(skip: number = 0, limit: number = 100): Promise<PaginatedResponse<Task>> {
    return this.request<PaginatedResponse<Task>>(
      `${API_ENDPOINTS.TASKS.LIST}?skip=${skip}&limit=${limit}`
    )
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await this.request<SingleResponse<Task>>(
      API_ENDPOINTS.TASKS.UPDATE.replace('{id}', id)
    )
    return response.data[0]
  }

  async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await this.request<SingleResponse<Task>>(
      API_ENDPOINTS.TASKS.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(taskData),
      }
    )
    return response.data[0]
  }

  async updateTask(id: string, taskData: TaskUpdate): Promise<Task> {
    const response = await this.request<SingleResponse<Task>>(
      API_ENDPOINTS.TASKS.UPDATE.replace('{id}', id),
      {
        method: 'PATCH',
        body: JSON.stringify(taskData),
      }
    )
    return response.data[0]
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(
      API_ENDPOINTS.TASKS.DELETE.replace('{id}', id),
      {
        method: 'DELETE',
      }
    )
  }
}

export const taskService = new TaskService() 