"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaskCard } from "@/components/task-card";
import { TaskFiltersComponent } from "@/components/task-filters";
import { ProtectedRoute } from "@/components/protected-route";
import { taskService } from "@/lib/services/task-service";
import type { Task, TaskFilters, PaginatedResponse } from "@/lib/types/task";

const TASKS_PER_PAGE = 6;

function TasksPageContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    prioridade: undefined,
    search: "",
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks: PaginatedResponse<Task> =
        await taskService.getTasks();
      setTasks(fetchedTasks.data);
    } catch (err) {
      setError("Falha ao carregar tarefas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: Task["status"]
  ) => {
    try {
      const newStatus =
        currentStatus === "CONCLUIDA" ? "PENDENTE" : "CONCLUIDA";
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } catch (err) {
        setError("Falha ao excluir tarefa.");
      }
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === undefined || task.status === filters.status;
      const matchesPriority =
        filters.prioridade === undefined ||
        task.prioridade === filters.prioridade;
      const matchesSearch =
        filters.search === undefined ||
        task.titulo.toLowerCase().includes(filters.search!.toLowerCase());

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
