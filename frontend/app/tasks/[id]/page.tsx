"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, Flag, ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { taskService } from "@/lib/mock-data";
import type { Task } from "@/lib/types";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const taskId = Number.parseInt(params.id);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!task) return;

    try {
      const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      const updatedTask = await taskService.updateTask(task.id, {
        status: newStatus,
      });
      if (updatedTask) {
        setTask(updatedTask);
      }
    } catch (err) {
      setError("Falha ao atualizar status da tarefa.");
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        const success = await taskService.deleteTask(task.id);
        if (success) {
          router.push("/tasks");
        }
      } catch (err) {
        setError("Falha ao excluir tarefa.");
      }
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    return status === "COMPLETED"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Média";
      case "LOW":
        return "Baixa";
      default:
        return priority;
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    return status === "COMPLETED" ? "Concluída" : "Pendente";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando tarefa...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-destructive">Tarefa não encontrada.</p>
          <Button asChild>
            <Link href="/tasks">Voltar para Tarefas</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Tarefas
            </Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle
                className={`text-2xl ${
                  task.status === "COMPLETED"
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {task.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className={getPriorityColor(task.priority)}
                >
                  <Flag className="w-3 h-3 mr-1" />
                  {getPriorityLabel(task.priority)}
                </Badge>
                <Badge
                  variant="outline"
                  className={getStatusColor(task.status)}
                >
                  {getStatusLabel(task.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {task.description && (
              <div className="space-y-2">
                <h3 className="font-semibold">Descrição</h3>
                <p
                  className={`text-sm leading-relaxed ${
                    task.status === "COMPLETED"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {task.description}
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {task.due_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Data de Vencimento:</span>
                  <span>
                    {format(new Date(task.due_date), "dd 'de' MMMM 'de' yyyy")}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Criado em:</span>
                <span>
                  {format(
                    new Date(task.creation_date),
                    "dd 'de' MMMM 'de' yyyy 'às' HH:mm"
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Última Atualização:</span>
                <span>
                  {format(
                    new Date(task.update_date),
                    "dd 'de' MMMM 'de' yyyy 'às' HH:mm"
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button asChild>
                <Link href={`/tasks/edit/${task.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Tarefa
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleStatus}
                className={
                  task.status === "COMPLETED"
                    ? "text-blue-600"
                    : "text-green-600"
                }
              >
                {task.status === "COMPLETED"
                  ? "Marcar como Pendente"
                  : "Marcar como Concluída"}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Tarefa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
