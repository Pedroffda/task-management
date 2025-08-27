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
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KanbanColumn } from "@/components/kanban-column";
import { KanbanTaskCard } from "@/components/kanban-task-card";
import { taskService } from "@/lib/services/task-service";
import type { Task, TaskUpdate } from "@/lib/types/task";

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
      setError(null); // Clear previous errors
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks.data as Task[]);
    } catch (err) {
      setError("Falha ao carregar tarefas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks
    .filter((task) => task.status === "PENDENTE")
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const completedTasks = tasks
    .filter((task) => task.status === "CONCLUIDA")
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

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

    // This is the optimistic update for moving between columns
    const overIsColumn = overId === "PENDENTE" || overId === "CONCLUIDA";
    if (overIsColumn && activeTask.status !== overId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeId
            ? { ...task, status: overId as "PENDENTE" | "CONCLUIDA" }
            : task
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // The state might have been updated by onDragOver. We work with the current `tasks` state.
    let newTasks = [...tasks];

    const activeTask = newTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const overTask = newTasks.find((t) => t.id === overId);

    // Determine the destination status and perform reordering
    const destinationStatus = overTask
      ? overTask.status
      : (overId as "PENDENTE" | "CONCLUIDA");

    // Update status if it changed (handles drops on tasks in other columns)
    if (activeTask.status !== destinationStatus) {
      activeTask.status = destinationStatus;
    }

    const activeIndex = newTasks.findIndex((t) => t.id === activeId);
    let overIndex = newTasks.findIndex((t) => t.id === overId);

    // If dropping on a column, find the last index for that status
    if (overIndex === -1 && (overId === "PENDENTE" || overId === "CONCLUIDA")) {
      const tasksInColumn = newTasks.filter((t) => t.status === overId);
      overIndex = activeIndex + tasksInColumn.length; // Place it at the end of its new column
    }

    // Perform the array move for reordering
    if (activeIndex !== overIndex) {
      newTasks = arrayMove(newTasks, activeIndex, overIndex);
    }

    // Recalculate 'ordem' for the affected column(s)
    const originalStatus = tasks.find((t) => t.id === activeId)?.status;
    const finalStatus = activeTask.status;

    const columnsToUpdate = new Set([originalStatus, finalStatus]);

    columnsToUpdate.forEach((status) => {
      if (!status) return;
      const tasksInColumn = newTasks.filter((t) => t.status === status);
      tasksInColumn.forEach((task, index) => {
        const taskInNewTasks = newTasks.find((t) => t.id === task.id);
        if (taskInNewTasks) {
          taskInNewTasks.ordem = index;
        }
      });
    });

    // Set the final state optimistically
    setTasks(newTasks);

    const finalTask = newTasks.find((t) => t.id === activeId);
    if (!finalTask) return;

    // Persist the changes to the backend
    try {
      await taskService.updateTask(activeId.toString(), {
        status: finalTask.status,
        ordem: finalTask.ordem,
      } as TaskUpdate);
    } catch (err) {
      setError("Falha ao atualizar a tarefa. Revertendo alterações.");
      // On error, revert to the original state by reloading
      loadTasks();
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
          collisionDetection={closestCorners}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <KanbanColumn
              id="PENDENTE"
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
              id="CONCLUIDA"
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
