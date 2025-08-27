from fastapi import status
from datetime import datetime, timedelta
from api.models.task import StatusTarefa, PrioridadeTarefa


class TestTaskRoutes:
    """Test task management API routes."""
    
    def test_create_task_success(self, client, auth_headers):
        """Test successful task creation."""
        task_data = {
            "titulo": "New Test Task",
            "descricao": "This is a test task description",
            "status": StatusTarefa.PENDENTE,
            "prioridade": PrioridadeTarefa.ALTA,
            "data_vencimento": (datetime.now() + timedelta(days=7)).isoformat()
        }
        
        response = client.post("/api/v1/tarefas/", json=task_data, headers=auth_headers)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        
        # The API returns a wrapper with data array and total
        assert "data" in data
        assert isinstance(data["data"], list)
        assert len(data["data"]) > 0
        
        # Check first task structure
        task = data["data"][0]
        assert "id" in task
        assert task["titulo"] == task_data["titulo"]
        assert task["descricao"] == task_data["descricao"]
        assert task["status"] == task_data["status"]
        assert task["prioridade"] == task_data["prioridade"]
        assert "usuario_id" in task
        assert "created_at" in task
        assert "updated_at" in task
    
    def test_create_task_unauthenticated(self, client):
        """Test task creation without authentication."""
        task_data = {
            "titulo": "New Test Task",
            "descricao": "This is a test task description",
            "status": StatusTarefa.PENDENTE,
            "prioridade": PrioridadeTarefa.ALTA,
            "data_vencimento": (datetime.now() + timedelta(days=7)).isoformat()
        }
        
        response = client.post("/api/v1/tarefas/", json=task_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_task_invalid_data(self, client, auth_headers):
        """Test task creation with invalid data."""
        # Missing required fields
        task_data = {
            "titulo": "New Test Task"
            # Missing description, status, priority, due date
        }
        
        response = client.post("/api/v1/tarefas/", json=task_data, headers=auth_headers)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_get_user_tasks(self, client, auth_headers, test_task):
        """Test getting tasks for authenticated user."""
        response = client.get("/api/v1/tarefas/", headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # The API returns a wrapper with data array and total
        assert "data" in data
        assert "total" in data
        assert isinstance(data["data"], list)
        assert len(data["data"]) >= 1  # At least the test task
        
        # Check first task structure
        if data["data"]:
            task = data["data"][0]
            assert "id" in task
            assert "titulo" in task
            assert "descricao" in task
            assert "status" in task
            assert "prioridade" in task
            assert "data_vencimento" in task
            assert "usuario_id" in task
    
    def test_get_user_tasks_unauthenticated(self, client):
        """Test getting tasks without authentication."""
        response = client.get("/api/v1/tarefas/")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_task_by_id(self, client, auth_headers, test_task):
        """Test getting a specific task by ID."""
        response = client.get(f"/api/v1/tarefas/{test_task.id}", headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # The API returns {"data": [item]} structure
        assert "data" in data
        assert isinstance(data["data"], list)
        assert len(data["data"]) == 1
        
        task = data["data"][0]
        # Check response structure
        assert task["id"] == str(test_task.id)  # Convert UUID to string for comparison
        assert task["titulo"] == test_task.titulo
        assert task["descricao"] == test_task.descricao
        assert task["status"] == test_task.status
        assert task["prioridade"] == test_task.prioridade
    
    def test_get_task_by_id_not_found(self, client, auth_headers):
        """Test getting a non-existent task."""
        # Use a valid UUID format instead of "99999"
        response = client.get("/api/v1/tarefas/00000000-0000-0000-0000-000000000000", headers=auth_headers)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_get_task_by_id_unauthenticated(self, client, test_task):
        """Test getting a task without authentication."""
        response = client.get(f"/api/v1/tarefas/{test_task.id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_task_success(self, client, auth_headers, test_task):
        """Test successful task update."""
        update_data = {
            "titulo": "Updated Task Title",
            "descricao": "Updated task description",
            "status": StatusTarefa.CONCLUIDA,
            "prioridade": PrioridadeTarefa.BAIXA
        }
        
        response = client.patch(f"/api/v1/tarefas/{test_task.id}", json=update_data, headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # The API returns {"data": [item]} structure
        assert "data" in data
        assert isinstance(data["data"], list)
        assert len(data["data"]) == 1
        
        task = data["data"][0]
        # Check updated data
        assert task["titulo"] == update_data["titulo"]
        assert task["descricao"] == update_data["descricao"]
        assert task["status"] == update_data["status"]
        assert task["prioridade"] == update_data["prioridade"]
        assert task["id"] == str(test_task.id)  # Convert UUID to string for comparison
    
    def test_update_task_not_found(self, client, auth_headers):
        """Test updating a non-existent task."""
        update_data = {
            "titulo": "Updated Task Title",
            "descricao": "Updated task description",
            "status": StatusTarefa.CONCLUIDA,
            "prioridade": PrioridadeTarefa.BAIXA
        }
        
        # Use a valid UUID format instead of "99999"
        response = client.patch("/api/v1/tarefas/00000000-0000-0000-0000-000000000000", json=update_data, headers=auth_headers)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_task_unauthenticated(self, client, test_task):
        """Test updating a task without authentication."""
        update_data = {
            "titulo": "Updated Task Title",
            "descricao": "Updated task description"
        }
        
        response = client.patch(f"/api/v1/tarefas/{test_task.id}", json=update_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_delete_task_success(self, client, auth_headers, test_task):
        """Test successful task deletion."""
        task_id = test_task.id
        
        response = client.delete(f"/api/v1/tarefas/{task_id}", headers=auth_headers)
        
        # The API returns 204 No Content for successful deletion
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify task is deleted
        get_response = client.get(f"/api/v1/tarefas/{task_id}", headers=auth_headers)
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_task_not_found(self, client, auth_headers):
        """Test deleting a non-existent task."""
        # Use a valid UUID format instead of "99999"
        response = client.delete("/api/v1/tarefas/00000000-0000-0000-0000-000000000000", headers=auth_headers)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_task_unauthenticated(self, client, test_task):
        """Test deleting a task without authentication."""
        response = client.delete(f"/api/v1/tarefas/{test_task.id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_task_status(self, client, auth_headers, test_task):
        """Test updating task status."""
        status_data = {"status": StatusTarefa.CONCLUIDA}
        
        response = client.patch(f"/api/v1/tarefas/{test_task.id}", json=status_data, headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # The API returns {"data": [item]} structure
        assert "data" in data
        assert isinstance(data["data"], list)
        assert len(data["data"]) == 1
        
        task = data["data"][0]
        # Check status is updated
        assert task["status"] == StatusTarefa.CONCLUIDA
        assert task["id"] == str(test_task.id)  # Convert UUID to string for comparison
    
    def test_update_task_status_invalid(self, client, auth_headers, test_task):
        """Test updating task status with invalid value."""
        status_data = {"status": "INVALID_STATUS"}
        
        response = client.patch(f"/api/v1/tarefas/{test_task.id}", json=status_data, headers=auth_headers)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY 