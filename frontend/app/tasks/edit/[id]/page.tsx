"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { taskService } from "@/lib/services/task-service";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import type { TaskFormData, taskSchema } from "@/lib/validations";

interface EditTaskPageProps {
  params: {
    id: string;
  };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const [task, setTask] = useState<Task | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const taskId = params.id;

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setIsLoadingTask(true);
      const foundTask = await taskService.getTaskById(taskId);

      if (foundTask) {
        setTask(foundTask as unknown as Task);
        console.log(foundTask);
      } else {
        setError("Tarefa não encontrada.");
      }
    } catch (err) {
      setError("Falha ao carregar tarefa.");
    } finally {
      setIsLoadingTask(false);
    }
  };

  const handleSubmit = async (data: TaskFormData) => {
    if (!task) return;

    setIsLoading(true);
    setError(null);

    try {
      await taskService.updateTask(task.id, {
        titulo: data.titulo,
        descricao: data.descricao || "",
        status: data.status as TaskStatus,
        prioridade: data.prioridade as TaskPriority,
        data_vencimento: data.data_vencimento || "",
      });

      // Redirecionar para a lista de tarefas em caso de sucesso
      router.push("/tasks");
    } catch (err) {
      setError("Falha ao atualizar tarefa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTask) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando tarefa...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-destructive">Tarefa não encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <TaskForm
      task={task}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
