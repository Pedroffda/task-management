"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaskCard } from "@/components/task-card";
import { TaskFiltersComponent } from "@/components/task-filters";
import { ProtectedRoute } from "@/components/protected-route";
import { taskService } from "@/lib/mock-data";
import type { Task, TaskFilters } from "@/lib/types";

const TASKS_PER_PAGE = 6;

function TasksPageContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "ALL",
    priority: "ALL",
    search: "",
  });

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

  const handleToggleStatus = async (
    id: number,
    currentStatus: Task["status"]
  ) => {
    try {
      const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
      const updatedTask = await taskService.updateTask(id, {
        status: newStatus,
      });
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id.toString() ? updatedTask : task))
        );
      }
    } catch (err) {
      setError("Falha ao atualizar status da tarefa.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        const success = await taskService.deleteTask(id);
        if (success) {
          setTasks((prev) => prev.filter((task) => task.id !== id.toString()));
        }
      } catch (err) {
        setError("Falha ao excluir tarefa.");
      }
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === "ALL" || task.status === filters.status;
      const matchesPriority =
        filters.priority === "ALL" || task.priority === filters.priority;
      const matchesSearch =
        filters.search === "" ||
        task.title.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filters]);

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Tarefa
            </Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TaskFiltersComponent filters={filters} onFiltersChange={setFilters} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {paginatedTasks.length} de {filteredTasks.length}{" "}
              tarefas
            </p>
          </div>

          {paginatedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma tarefa encontrada com seus critérios.
              </p>
              <Button asChild className="mt-4">
                <Link href="/tasks/new">Criar sua primeira tarefa</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksPageContent />
    </ProtectedRoute>
  );
}
