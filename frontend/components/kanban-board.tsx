"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KanbanColumn } from "@/components/kanban-column";
import { KanbanTaskCard } from "@/components/kanban-task-card";
import { taskService } from "@/lib/mock-data";
import type { Task } from "@/lib/types";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Falha ao carregar tarefas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks
    .filter((task) => task.status === "PENDING")
    .sort((a, b) => a.order - b.order);

  const completedTasks = tasks
    .filter((task) => task.status === "COMPLETED")
    .sort((a, b) => a.order - b.order);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Handle dropping over a column
    if (overId === "PENDING" || overId === "COMPLETED") {
      if (activeTask.status !== overId) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === activeId
              ? { ...task, status: overId as "PENDING" | "COMPLETED" }
              : task
          )
        );
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // If dropping over a column, just update status
    if (overId === "PENDING" || overId === "COMPLETED") {
      if (activeTask.status !== overId) {
        try {
          await taskService.updateTask(Number(activeTask.id), {
            status: overId as "PENDING" | "COMPLETED",
          });
          loadTasks();
        } catch (err) {
          setError("Falha ao atualizar status da tarefa.");
        }
      }
      return;
    }

    // If dropping over another task, reorder
    if (overTask && activeTask.id !== overTask.id) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(activeIndex, 1);

        // Update status if moving to different column
        if (overTask.status !== movedTask.status) {
          movedTask.status = overTask.status;
        }

        newTasks.splice(overIndex, 0, movedTask);

        // Update order for tasks in the same status
        const statusTasks = newTasks.filter(
          (t) => t.status === movedTask.status
        );
        statusTasks.forEach((task, index) => {
          task.order = index;
        });

        setTasks(newTasks);

        try {
          await taskService.reorderTasks(newTasks);
        } catch (err) {
          setError("Falha ao reordenar tarefas.");
          loadTasks(); // Reload on error
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Quadro de Tarefas</h1>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <KanbanColumn
              id="PENDING"
              title="Pendente"
              count={pendingTasks.length}
              color="blue"
            >
              <SortableContext
                items={pendingTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {pendingTasks.map((task) => (
                  <KanbanTaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
            </KanbanColumn>

            <KanbanColumn
              id="COMPLETED"
              title="Concluído"
              count={completedTasks.length}
              color="green"
            >
              <SortableContext
                items={completedTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {completedTasks.map((task) => (
                  <KanbanTaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
            </KanbanColumn>
          </div>

          <DragOverlay>
            {activeTask ? (
              <KanbanTaskCard task={activeTask} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
