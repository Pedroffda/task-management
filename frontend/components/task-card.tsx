"use client";

import { format } from "date-fns";
import { Calendar, Clock, Flag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: number, currentStatus: Task["status"]) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle
            className={`text-lg ${
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
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.description && (
          <p
            className={`text-sm ${
              task.status === "COMPLETED"
                ? "text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {task.description}
          </p>
        )}

        {task.due_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Vencimento: {format(new Date(task.due_date), "dd/MM/yyyy")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            Criado em: {format(new Date(task.creation_date), "dd/MM/yyyy")}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/${task.id}`}>Ver Detalhes</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/edit/${task.id}`}>Editar</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(Number(task.id), task.status)}
            className={
              task.status === "COMPLETED" ? "text-blue-600" : "text-green-600"
            }
          >
            {task.status === "COMPLETED"
              ? "Marcar como Pendente"
              : "Marcar como Concluída"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(Number(task.id))}
          >
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
