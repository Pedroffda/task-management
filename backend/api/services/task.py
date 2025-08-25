from api.models.task import Tarefa
from api.schemas.task import TaskCreate, TaskUpdate
from api.repositories.task import TaskRepository
from api.core.exceptions import ExceptionNotFound
import uuid

class TaskService:
    def __init__(self, task_repository: TaskRepository): 
        self.task_repository = task_repository

    def create_task(self, task_data: TaskCreate, current_user) -> Tarefa:
        new_task = self.task_repository.add_task(task_data, current_user.id)
        return new_task

    def get_task_by_id(self, task_id: str) -> Tarefa:
        return self.task_repository.get_task_by_id(uuid.UUID(task_id))
    
    def list_tasks(self, skip: int = 0, limit: int = 100) -> tuple[list[Tarefa], int]:
        tasks, total = self.task_repository.list_tasks(skip, limit)
        return tasks, total
    
    def update_task(self, task_id: str, task_data: TaskUpdate) -> Tarefa:
        task = self.task_repository.get_task_by_id(uuid.UUID(task_id))
        if not task:
            raise ExceptionNotFound("Tarefa não encontrada.")
        updated_task = self.task_repository.update_task(uuid.UUID(task_id), task_data)
        return updated_task
    
    def delete_task(self, task_id: str) -> None:
        task = self.task_repository.get_task_by_id(uuid.UUID(task_id))
        if not task:
            raise ExceptionNotFound("Tarefa não encontrada.")
        self.task_repository.delete_task(uuid.UUID(task_id))
        return None