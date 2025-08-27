"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { taskService } from "@/lib/mock-data";
import type { Task } from "@/lib/types";
import type { TaskFormData } from "@/lib/validations";

interface EditTaskPageProps {
  params: {
    id: string;
  };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const taskId = Number.parseInt(params.id);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setIsLoadingTask(true);
      const tasks = await taskService.getTasks();
      const foundTask = tasks.find((t) => t.id === taskId);

      if (foundTask) {
        setTask(foundTask);
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
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        due_date: data.due_date || null,
        order: task.order,
        user_id: task.user_id,
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
