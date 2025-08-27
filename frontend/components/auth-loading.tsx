"use client";

import { Loader2 } from "lucide-react";

export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Verificando autenticação...</p>
      </div>
    </div>
  );
}
