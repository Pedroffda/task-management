"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { taskService } from "@/lib/services/task-service";
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
        titulo: data.titulo,
        descricao: data.descricao || "",
        status: data.status,
        prioridade: data.prioridade,
        data_vencimento: data.data_vencimento || undefined,
        ordem: 0,
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
