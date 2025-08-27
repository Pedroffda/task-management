"use client";

import React, { useEffect } from "react";
import { useTasks } from "../lib/hooks/use-tasks";

// Exemplo básico de uso do hook useTasks
export function BasicTaskExample() {
  const { tasks, loading, error, fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Minhas Tarefas ({tasks.length})</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.titulo}</strong> - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Exemplo de criação de tarefa
export function CreateTaskExample() {
  const { createTask, loading } = useTasks();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await createTask({
        titulo: formData.get("titulo") as string,
        descricao: formData.get("descricao") as string,
        status: "PENDENTE",
        prioridade: "MEDIA",
        data_vencimento: new Date().toISOString(),
      });
      alert("Tarefa criada com sucesso!");
      e.currentTarget.reset();
    } catch (error) {
      alert("Erro ao criar tarefa");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="titulo" placeholder="Título da tarefa" required />
      <textarea name="descricao" placeholder="Descrição" required />
      <button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar Tarefa"}
      </button>
    </form>
  );
}

// Exemplo de atualização de tarefa
export function UpdateTaskExample({ taskId }: { taskId: string }) {
  const { updateTask, loading } = useTasks();

  const handleStatusChange = async (
    newStatus: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA"
  ) => {
    try {
      await updateTask(taskId, { status: newStatus });
      alert("Status atualizado!");
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  return (
    <div>
      <button onClick={() => handleStatusChange("PENDENTE")} disabled={loading}>
        Marcar como Pendente
      </button>
      <button
        onClick={() => handleStatusChange("EM_ANDAMENTO")}
        disabled={loading}
      >
        Marcar como Em Andamento
      </button>
      <button
        onClick={() => handleStatusChange("CONCLUIDA")}
        disabled={loading}
      >
        Marcar como Concluída
      </button>
    </div>
  );
}

// Exemplo de deleção de tarefa
export function DeleteTaskExample({ taskId }: { taskId: string }) {
  const { deleteTask, loading } = useTasks();

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await deleteTask(taskId);
        alert("Tarefa deletada com sucesso!");
      } catch (error) {
        alert("Erro ao deletar tarefa");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{ backgroundColor: "red", color: "white" }}
    >
      {loading ? "Deletando..." : "Deletar Tarefa"}
    </button>
  );
}
