"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import type { Task } from "@/lib/types";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function TaskForm({
  task,
  onSubmit,
  isLoading = false,
  error,
}: TaskFormProps) {
  const router = useRouter();
  const isEditing = !!task;

  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return dateString.split("T")[0];
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      titulo: task?.titulo || "",
      descricao: task?.descricao || "",
      status: task?.status || "PENDENTE",
      prioridade: task?.prioridade || "MEDIA",
      data_vencimento: formatDateForInput(task?.data_vencimento) || null,
    },
  });

  const watchedStatus = watch("status");
  const watchedPriority = watch("prioridade");

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEditing ? "Editar Tarefa" : "Criar Nova Tarefa"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Digite o título da tarefa"
                  {...register("titulo")}
                  className={errors.titulo ? "border-destructive" : ""}
                />
                {errors.titulo && (
                  <p className="text-sm text-destructive">
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Digite a descrição da tarefa (opcional)"
                  rows={4}
                  {...register("descricao")}
                  className={errors.descricao ? "border-destructive" : ""}
                />
                {errors.descricao && (
                  <p className="text-sm text-destructive">
                    {errors.descricao.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watchedStatus}
                    onValueChange={(value) =>
                      setValue("status", value as "PENDENTE" | "CONCLUIDA")
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={watchedPriority}
                    onValueChange={(value) =>
                      setValue(
                        "prioridade",
                        value as "BAIXA" | "MEDIA" | "ALTA"
                      )
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAIXA">Baixa</SelectItem>
                      <SelectItem value="MEDIA">Média</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.prioridade && (
                    <p className="text-sm text-destructive">
                      {errors.prioridade.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  {...register("data_vencimento")}
                  className={errors.data_vencimento ? "border-destructive" : ""}
                />
                {errors.data_vencimento && (
                  <p className="text-sm text-destructive">
                    {errors.data_vencimento.message ||
                      "Data de vencimento inválida"}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading
                    ? "Salvando..."
                    : isEditing
                    ? "Salvar Tarefa"
                    : "Criar Tarefa"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
