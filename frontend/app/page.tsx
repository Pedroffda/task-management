import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-balance">
            Bem-vindo ao TaskManager
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Organize suas tarefas de forma eficiente com nosso sistema moderno
            de gerenciamento de tarefas. Crie, acompanhe e complete suas tarefas
            com facilidade.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Começar</CardTitle>
              <CardDescription>
                Crie uma conta ou faça login para começar a gerenciar suas
                tarefas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/register">Criar Conta</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full bg-transparent"
              >
                <Link href="/login">Entrar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suas Tarefas</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as suas tarefas em um só lugar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/tasks">Ver Tarefas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
