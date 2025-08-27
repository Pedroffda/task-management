"use client";

import { KanbanBoard } from "@/components/kanban-board";
import { ProtectedRoute } from "@/components/protected-route";

export default function TaskBoardPage() {
  return (
    <ProtectedRoute>
      <KanbanBoard />
    </ProtectedRoute>
  );
}
