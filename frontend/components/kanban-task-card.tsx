"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Calendar, Flag, GripVertical } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types/task";

interface KanbanTaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function KanbanTaskCard({
  task,
  isDragging = false,
}: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Task["prioridade"]) => {
    switch (priority) {
      case "ALTA":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIA":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "BAIXA":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const cardContent = (
    <Card
      className={`cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        isDragging || isSortableDragging ? "opacity-50 rotate-3 shadow-lg" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {task.titulo}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={getPriorityColor(task.prioridade)}
              //   variant="outline"
            >
              <Flag className="w-3 h-3 mr-1" />
              {task.prioridade}
            </Badge>
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.descricao && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.descricao}
          </p>
        )}

        {task.data_vencimento && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(task.data_vencimento), "MMM dd")}</span>
          </div>
        )}

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs h-7 bg-transparent"
          >
            <Link href={`/tasks/${task.id}`}>Visualizar</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs h-7 bg-transparent"
          >
            <Link href={`/tasks/edit/${task.id}`}>Editar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isDragging) {
    return cardContent;
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {cardContent}
    </div>
  );
}
