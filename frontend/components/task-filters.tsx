"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskFilters } from "@/lib/types/task";
import { Button } from "./ui/button";

interface TaskFiltersComponentProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export function TaskFiltersComponent({
  filters,
  onFiltersChange,
}: TaskFiltersComponentProps) {
  const handleFieldChange = (field: keyof TaskFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value === "TODAS" ? undefined : value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="p-4 bg-muted/50 rounded-lg border">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid gap-1.5 flex-1 min-w-[200px] sm:min-w-[250px]">
            <Label htmlFor="search">Buscar Tarefas</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Buscar por título..."
                value={filters.search ?? ""}
                onChange={(e) => handleFieldChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-1.5 min-w-[150px] flex-1">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status ?? "TODAS"}
              onValueChange={(value) => handleFieldChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAS">Todos</SelectItem>
                <SelectItem value="PENDENTE">Pendentes</SelectItem>
                <SelectItem value="CONCLUIDA">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5 min-w-[150px] flex-1">
            <Label htmlFor="priority">Prioridade</Label>
            <Select
              value={filters.prioridade ?? "TODAS"}
              onValueChange={(value) => handleFieldChange("prioridade", value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAS">Todas</SelectItem>
                <SelectItem value="BAIXA">Baixa</SelectItem>
                <SelectItem value="MEDIA">Média</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end">
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}
