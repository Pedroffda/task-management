"use client";

import type React from "react";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  color: "blue" | "green";
  children: React.ReactNode;
}

export function KanbanColumn({
  id,
  title,
  count,
  color,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const colorClasses = {
    blue: "border-blue-200 bg-blue-50/50",
    green: "border-green-200 bg-green-50/50",
  };

  const badgeClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <Card
      ref={setNodeRef}
      className={`min-h-[600px] transition-colors ${
        isOver ? "ring-2 ring-primary ring-offset-2" : ""
      } ${colorClasses[color]}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary" className={badgeClasses[color]}>
            {count}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}
