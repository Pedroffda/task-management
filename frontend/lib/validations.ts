import { z } from "zod"

// Esquema de validação do formulário de login
export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um endereço de email válido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Esquema de validação do formulário de registro
export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Por favor, insira um endereço de email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Esquema de validação do formulário de tarefa
export const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  due_date: z.string().optional().nullable(),
})

export type TaskFormData = z.infer<typeof taskSchema>
