# Sistema de Gerenciamento de Tarefas

## 🎯 Objetivo
Desenvolver um sistema completo de gerenciamento de tarefas que demonstre conhecimentos em desenvolvimento full-stack com as tecnologias especificadas.

## 🛠 Tecnologias Implementadas

### Backend
- **Framework**: Python FastAPI
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Gerenciamento de Dependências**: Poetry
- **Documentação**: Swagger/OpenAPI + README.md
- **Containerização**: Docker e Docker Compose
- **Migrações**: Alembic

### Frontend
- **Framework**: Next.js 15.5.0 (React 19)
- **Validação**: Zod para validação de formulários
- **TypeScript**: ✅ Implementado
- **Gerenciamento de Dependências**: pnpm
- **UI Components**: Radix UI + Tailwind CSS
- **Drag & Drop**: @dnd-kit para gerenciamento de tarefas

## 🚀 Funcionalidades Implementadas

### Autenticação
- [X] Registro de usuário
- [X] Login com email e senha
- [X] Proteção de rotas com JWT
- [X] Logout

### Gerenciamento de Tarefas
- [X] Listar todas as tarefas do usuário logado
- [X] Criar nova tarefa
- [X] Visualizar detalhes de uma tarefa
- [X] Editar tarefa existente
- [X] Excluir tarefa
- [X] Marcar tarefa como concluída/pendente
- [X] Drag & Drop para reordenar tarefas

## 📊 Estrutura de Dados

### Usuário
```json
{
  "id": "Long",
  "nome": "String",
  "email": "String (único)",
  "senha": "String",
  "data_criacao": "DateTime",
  "data_atualizacao": "DateTime"
}
```

### Tarefa
```json
{
  "id": "Long",
  "titulo": "String",
  "descricao": "String",
  "status": "PENDENTE | CONCLUIDA",
  "prioridade": "BAIXA | MEDIA | ALTA",
  "data_vencimento": "Date",
  "data_criacao": "DateTime",
  "data_atualizacao": "DateTime",
  "usuario_id": "Long"
}
```

## 🔗 APIs Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/userinfo` - Dados do usuário logado

### Tarefas
- `GET /api/tasks` - Listar tarefas do usuário
- `POST /api/tasks` - Criar nova tarefa
- `GET /api/tasks/{id}` - Buscar tarefa por ID
- `PUT /api/tasks/{id}` - Atualizar tarefa
- `DELETE /api/tasks/{id}` - Excluir tarefa
- `PATCH /api/tasks/{id}/status` - Alterar status da tarefa

## 🏗 Estrutura do Projeto - Monorepo

```
task-management/
├── backend/                 # FastAPI Python API
│   ├── api/                # Endpoints da API
│   ├── migrations/         # Migrações do banco (Alembic)
│   ├── pyproject.toml      # Dependências Python (Poetry)
│   ├── poetry.lock         # Lock file das dependências
│   └── Dockerfile          # Containerização do backend
├── frontend/               # Next.js App
│   ├── app/                # App Router do Next.js
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitários e configurações
│   ├── contexts/           # Contextos React
│   ├── package.json        # Dependências Node.js
│   ├── pnpm-lock.yaml      # Lock file das dependências
│   └── Dockerfile          # Containerização do frontend
├── docker-compose.yml      # Orquestração dos containers
└── README.md               # Este arquivo
```

## ⚡ Execução Local

### Pré-requisitos
- Docker
- Docker Compose

### Passos para Execução

```bash
# Clone o repositório
git clone https://github.com/Pedroffda/task-management.git
cd task-management

# Executar com Docker Compose
docker compose up -d

# Aguardar todos os serviços iniciarem (pode levar alguns minutos na primeira execução)
# Verificar status dos containers
docker compose ps

# Ver logs em tempo real (opcional)
docker compose logs -f
```

### Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Documentação Swagger**: http://localhost:8001/docs
- **Banco de Dados**: PostgreSQL rodando na porta 5332

### Comandos Úteis

```bash
# Parar todos os serviços
docker compose down

# Parar e remover volumes (cuidado: apaga dados do banco)
docker compose down -v

# Reconstruir containers após mudanças
docker compose up -d --build

# Ver logs de um serviço específico
docker compose logs -f api      # Backend
docker compose logs -f web      # Frontend
docker compose logs -f db       # Banco de dados
```

## 🔧 Desenvolvimento

### Estrutura dos Containers

- **`task_manager_frontend`**: Container Next.js na porta 3000
- **`task_manager_api`**: Container FastAPI na porta 8001
- **`task_manager_db`**: Container PostgreSQL na porta 5332

### Volumes e Persistência

- O banco de dados é persistido através do volume `task_manager_data`
- O código fonte é montado nos containers para desenvolvimento
- Alterações no código são refletidas automaticamente (hot reload)

### Variáveis de Ambiente

- **Frontend**: `NEXT_PUBLIC_API_URL=http://localhost:8001`
- **Backend**: 
  - `DATABASE_URL`: Conexão com PostgreSQL
  - `SECRET_KEY`: Chave para JWT
  - `ALGORITHM`: Algoritmo de criptografia
  - `ACCESS_TOKEN_EXPIRE_MINUTES`: Tempo de expiração do token
