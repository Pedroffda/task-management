"use client";

import React, { useEffect, useState } from "react";
import { useTasks } from "../lib/hooks/use-tasks";
import type { Task, TaskCreate, TaskUpdate } from "../lib/types/task"; // Adicione TaskUpdate
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, XCircle } from "lucide-react";

// Mapeamentos para os Badges
const statusMap: Record<
  Task["status"],
  { text: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDENTE: { text: "Pendente", variant: "secondary" },
  EM_ANDAMENTO: { text: "Em Andamento", variant: "default" },
  CONCLUIDA: { text: "Concluída", variant: "outline" },
};

const priorityMap: Record<
  Task["prioridade"],
  { text: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  BAIXA: { text: "Baixa", variant: "secondary" },
  MEDIA: { text: "Média", variant: "default" },
  ALTA: { text: "Alta", variant: "destructive" },
};

export default function TaskList() {
  const {
    tasks,
    loading,
    error,
    total,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useTasks();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData: TaskCreate = {
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      status: "PENDENTE",
      prioridade: "MEDIA",
      data_vencimento: new Date().toISOString(), // Ou use um campo de data
    };
    await createTask(taskData);
    setShowCreateForm(false);
  };

  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;

    const formData = new FormData(e.currentTarget);
    const taskData: TaskUpdate = {
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      status: formData.get("status") as Task["status"],
      prioridade: formData.get("prioridade") as Task["prioridade"],
    };
    await updateTask(editingTask.id, taskData);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      await deleteTask(id);
    }
  };

  if (loading)
    return <div className="text-center py-12">Carregando tarefas...</div>;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Tarefas ({total})</h1>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? "outline" : "default"}
        >
          {showCreateForm ? "Cancelar" : "Nova Tarefa"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Ocorreu um erro!</AlertTitle>
          <AlertDescription>
            {error}
            <button onClick={clearError} className="ml-2 font-bold underline">
              Fechar
            </button>
          </AlertDescription>
        </Alert>
      )}

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Criar Nova Tarefa</CardTitle>
            <CardDescription>
              Preencha os detalhes da sua nova tarefa.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateTask}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  placeholder="Ex: Desenvolver a tela de login"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva os detalhes da tarefa..."
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Criar Tarefa</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            {editingTask?.id === task.id ? (
              // Formulário de Edição
              <form onSubmit={handleUpdateTask}>
                <CardHeader>
                  <CardTitle>Editando Tarefa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-titulo-${task.id}`}>Título</Label>
                    <Input
                      id={`edit-titulo-${task.id}`}
                      name="titulo"
                      defaultValue={task.titulo}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-descricao-${task.id}`}>
                      Descrição
                    </Label>
                    <Textarea
                      id={`edit-descricao-${task.id}`}
                      name="descricao"
                      defaultValue={task.descricao}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      {/* O Select do ShadCN não funciona nativamente com FormData, por isso o `name` é crucial */}
                      <Select name="status" defaultValue={task.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDENTE">Pendente</SelectItem>
                          <SelectItem value="EM_ANDAMENTO">
                            Em Andamento
                          </SelectItem>
                          <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select name="prioridade" defaultValue={task.prioridade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BAIXA">Baixa</SelectItem>
                          <SelectItem value="MEDIA">Média</SelectItem>
                          <SelectItem value="ALTA">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </CardFooter>
              </form>
            ) : (
              // Visualização da Tarefa
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{task.titulo}</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingTask(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Vence em:{" "}
                    {task.data_vencimento
                      ? new Date(task.data_vencimento).toLocaleDateString(
                          "pt-BR"
                        )
                      : "Não definida"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {task.descricao}
                  </p>
                </CardContent>
                <CardFooter className="flex space-x-2">
                  <Badge
                    variant={statusMap[task.status]?.variant || "secondary"}
                  >
                    {statusMap[task.status]?.text || task.status}
                  </Badge>
                  <Badge
                    variant={
                      priorityMap[task.prioridade]?.variant || "secondary"
                    }
                  >
                    {priorityMap[task.prioridade]?.text || task.prioridade}
                  </Badge>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>

      {tasks.length === 0 && !loading && !showCreateForm && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg mt-6">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
          <Button onClick={() => setShowCreateForm(true)} className="mt-4">
            Crie sua primeira tarefa
          </Button>
        </div>
      )}
    </div>
  );
}
