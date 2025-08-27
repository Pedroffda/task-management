"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirecionar para a página inicial após logout
    window.location.href = "/";
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            TaskManager
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/tasks">Minhas Tarefas</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/tasks/board">Quadro</Link>
                </Button>
                <ModeToggle />
                <span className="text-sm text-muted-foreground">
                  Bem-vindo, {user.name}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
