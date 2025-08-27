"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { taskService } from "@/lib/mock-data";
import type { TaskFormData } from "@/lib/validations";

export default function NewTaskPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await taskService.createTask({
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        due_date: data.due_date || null,
        order: 0,
      });

      // Redirecionar para a lista de tarefas em caso de sucesso
      router.push("/tasks");
    } catch (err) {
      setError("Falha ao criar tarefa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
  );
}
