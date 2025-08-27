# 🧪 Testes Automatizados - Backend

Este diretório contém todos os testes automatizados para o backend da aplicação de gerenciamento de tarefas.

## 📁 Estrutura dos Testes

```
tests/
├── conftest.py              # Configuração principal do pytest
├── factories/               # Factories para dados de teste
│   ├── user_factory.py     # Factory para usuários
│   └── task_factory.py     # Factory para tarefas
├── unit/                   # Testes unitários
│   ├── test_auth.py        # Testes do serviço de autenticação
│   └── test_task_service.py # Testes do serviço de tarefas
├── integration/            # Testes de integração
│   ├── test_auth_routes.py # Testes das rotas de autenticação
│   └── test_task_routes.py # Testes das rotas de tarefas
└── README.md               # Este arquivo
```

## 🎯 Cobertura dos Testes

### ✅ Autenticação
- **Testes Unitários**:
  - Hash e verificação de senhas
  - Criação de tokens JWT
  - Autenticação de usuários
  - Validação de credenciais

- **Testes de Integração**:
  - Registro de usuários
  - Login e logout
  - Obtenção de informações do usuário
  - Validação de tokens
  - Tratamento de erros

### ✅ Gerenciamento de Tarefas
- **Testes Unitários**:
  - Criação de tarefas
  - Atualização de tarefas
  - Exclusão de tarefas
  - Validação de dados
  - Transições de status

- **Testes de Integração**:
  - CRUD completo de tarefas
  - Autenticação obrigatória
  - Validação de entrada
  - Tratamento de erros
  - Atualização de status

## 🚀 Como Executar os Testes

### 1. Execução Local (Recomendado para Desenvolvimento)

```bash
# Navegar para o diretório backend
cd backend

# Instalar dependências de desenvolvimento
poetry install

# Executar todos os testes
poetry run pytest

# Executar testes com cobertura
poetry run pytest --cov=api --cov-report=term-missing --cov-report=html

# Executar testes específicos
poetry run pytest tests/unit/                    # Apenas testes unitários
poetry run pytest tests/integration/             # Apenas testes de integração
poetry run pytest -k "test_auth"                # Testes que contenham "test_auth"
poetry run pytest -m "not slow"                 # Testes rápidos
```

### 2. Execução com Docker

```bash
# Executar testes em container separado
docker compose --profile test up test

# Executar testes e gerar relatórios
docker compose --profile test run --rm test poetry run pytest --cov=api --cov-report=html

# Executar testes específicos
docker compose --profile test run --rm test poetry run pytest tests/unit/ -v
```

### 3. Script de Execução

```bash
# Executar script de testes automatizado
cd backend
python run_tests.py
```

## 📊 Relatórios de Cobertura

Os testes geram relatórios de cobertura em diferentes formatos:

- **Terminal**: Cobertura em texto no terminal
- **HTML**: Relatório detalhado em `htmlcov/index.html`
- **XML**: Relatório em formato XML para CI/CD

### Visualizar Relatório HTML

```bash
# Abrir relatório no navegador
cd backend
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

## 🔧 Configuração dos Testes

### Banco de Dados de Teste

- Os testes usam SQLite em memória para velocidade
- Cada teste tem seu próprio banco isolado
- Dados são limpos automaticamente após cada teste

### Fixtures Disponíveis

- `db_session`: Sessão do banco de dados
- `client`: Cliente HTTP para testes de API
- `auth_headers`: Headers de autenticação
- `test_user`: Usuário de teste
- `test_task`: Tarefa de teste

### Marcadores de Teste

- `@pytest.mark.slow`: Testes lentos
- `@pytest.mark.integration`: Testes de integração
- `@pytest.mark.unit`: Testes unitários

## 📝 Adicionando Novos Testes

### 1. Teste Unitário

```python
# tests/unit/test_new_feature.py
import pytest
from api.services.new_service import NewService

class TestNewService:
    def test_new_functionality(self):
        """Test new functionality."""
        service = NewService()
        result = service.do_something()
        assert result is not None
```

### 2. Teste de Integração

```python
# tests/integration/test_new_routes.py
import pytest
from fastapi import status

class TestNewRoutes:
    def test_new_endpoint(self, client, auth_headers):
        """Test new API endpoint."""
        response = client.get("/api/v1/new-endpoint", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
```

### 3. Nova Factory

```python
# tests/factories/new_factory.py
import factory
from api.models.new_model import NewModel

class NewModelFactory(factory.Factory):
    class Meta:
        model = NewModel
    
    name = factory.Faker('word')
    description = factory.Faker('sentence')
```

## 🐛 Solução de Problemas

### Erro: Módulo não encontrado
```bash
# Verificar se está no diretório correto
cd backend

# Reinstalar dependências
poetry install
```

### Erro: Banco de dados
```bash
# Limpar cache do pytest
poetry run pytest --cache-clear

# Verificar configuração do banco
poetry run pytest --setup-show
```

### Testes falhando
```bash
# Executar com mais detalhes
poetry run pytest -v -s

# Executar teste específico
poetry run pytest tests/unit/test_auth.py::TestAuthService::test_password_hashing -v -s
```

## 📈 Métricas de Qualidade

### Cobertura Mínima
- **Cobertura de Código**: 80%+
- **Cobertura de Branches**: 70%+
- **Cobertura de Funções**: 90%+

### Execução de Testes
- **Testes Unitários**: < 5 segundos
- **Testes de Integração**: < 30 segundos
- **Testes Completos**: < 2 minutos

## 🤝 Contribuição

1. **Sempre escreva testes** para novas funcionalidades
2. **Mantenha a cobertura** acima dos limites mínimos
3. **Use factories** para dados de teste consistentes
4. **Documente** testes complexos
5. **Execute testes** antes de fazer commit

## 📚 Recursos Adicionais

- [Documentação do pytest](https://docs.pytest.org/)
- [Factory Boy](https://factoryboy.readthedocs.io/)
- [Coverage.py](https://coverage.readthedocs.io/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/) 