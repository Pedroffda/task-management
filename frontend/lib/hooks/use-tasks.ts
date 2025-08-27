import { useState, useCallback } from 'react'
import { taskService } from '../services/task-service'
import { Task, TaskCreate, TaskUpdate, PaginatedResponse } from '../types/task'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchTasks = useCallback(async (skip: number = 0, limit: number = 100) => {
    try {
      setLoading(true)
      setError(null)
      const response: PaginatedResponse<Task> = await taskService.getTasks(skip, limit)
      setTasks(response.data)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar tarefas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (taskData: TaskCreate) => {
    try {
      setLoading(true)
      setError(null)
      const newTask = await taskService.createTask(taskData)
      setTasks(prev => [newTask, ...prev])
      setTotal(prev => prev + 1)
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTask = useCallback(async (id: string, taskData: TaskUpdate) => {
    try {
      setLoading(true)
      setError(null)
      const updatedTask = await taskService.updateTask(id, taskData)
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await taskService.deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
      setTotal(prev => prev - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar tarefa')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTaskById = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      return await taskService.getTaskById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar tarefa')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    tasks,
    loading,
    error,
    total,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    clearError,
  }
} 