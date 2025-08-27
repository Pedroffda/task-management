import uuid
from datetime import datetime
from typing import List, Optional, Tuple
from sqlalchemy import select, func, update
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from api.models.task import Tarefa
from api.schemas.task import TaskCreate, TaskUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class TaskRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def _not_excluido(self, usuario_id: Optional[uuid.UUID] = None):
        """Retorna a query base filtrada por tarefas não excluídas e do usuário específico"""
        query = select(Tarefa).where(Tarefa.flg_excluido == False)
        if usuario_id:
            query = query.where(Tarefa.usuario_id == usuario_id)
        return query

    def get_task_by_id(self, task_id: uuid.UUID, usuario_id: uuid.UUID) -> Tarefa | None:
        """Busca uma tarefa pelo ID, garantindo que pertence ao usuário logado."""
        stmt = self._not_excluido(usuario_id).where(Tarefa.id == task_id)
        result = self.db_session.execute(stmt)
        return result.scalars().first()

    def add_task(self, task_data: TaskCreate, usuario_id: Optional[uuid.UUID] = None) -> Tarefa:
        """Adiciona uma nova tarefa ao banco de dados."""
        try:
            if not task_data.usuario_id:
                task_data.usuario_id = usuario_id
                
            if not task_data.data_vencimento:
                task_data.data_vencimento = datetime.now()
            
            new_task = Tarefa(
                titulo=task_data.titulo,
                descricao=task_data.descricao,
                status=task_data.status,
                prioridade=task_data.prioridade,
                data_vencimento=task_data.data_vencimento,
                usuario_id=task_data.usuario_id
            )
            
            self.db_session.add(new_task)
            self.db_session.commit()
            self.db_session.refresh(new_task)
            
            # Ensure the task was created successfully
            if not new_task.id:
                raise Exception("Failed to create task - no ID generated")
                
            return new_task
        except Exception as e:
            self.db_session.rollback()
            raise Exception(f"Failed to create task: {str(e)}")

    def list_tasks(self, usuario_id: uuid.UUID, skip: int = 0, limit: int = 100) -> Tuple[List[Tarefa], int]:
        """Lista as tarefas do usuário logado com paginação."""
        stmt = (
            self._not_excluido(usuario_id)
            .order_by(Tarefa.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        tasks_result = self.db_session.execute(stmt)
        tasks = tasks_result.scalars().all()
        
        count_stmt = select(func.count()).select_from(self._not_excluido(usuario_id))
        total_result = self.db_session.execute(count_stmt)
        total = total_result.scalar_one()
        
        return tasks, total
    
    def update_task(self, task_id: uuid.UUID, task_data: TaskUpdate, usuario_id: uuid.UUID) -> Tarefa:
        """Atualiza os dados de uma tarefa existente, garantindo que pertence ao usuário logado."""
        try:
            update_data = task_data.model_dump(exclude_unset=True)
            
            stmt = (
                update(Tarefa)
                .where(Tarefa.id == task_id)
                .where(Tarefa.usuario_id == usuario_id)
                .values(**update_data)
                .returning(Tarefa)
            )
            
            result = self.db_session.execute(stmt)
            updated_task = result.scalars().first()
            
            if not updated_task:
                raise Exception("Tarefa não encontrada ou não pertence ao usuário logado")
            
            self.db_session.commit()
            self.db_session.refresh(updated_task)
            return updated_task
        except Exception as e:
            self.db_session.rollback()
            raise Exception(f"Failed to update task: {str(e)}")
    
    def delete_task(self, task_id: uuid.UUID, usuario_id: uuid.UUID) -> None:
        """Marca uma tarefa como excluído (exclusão lógica), garantindo que pertence ao usuário logado."""
        try:
            stmt = (
                update(Tarefa)
                .where(Tarefa.id == task_id)
                .where(Tarefa.usuario_id == usuario_id)
                .values(flg_excluido=True)
            )
            result = self.db_session.execute(stmt)
            
            if result.rowcount == 0:
                raise Exception("Tarefa não encontrada ou não pertence ao usuário logado")
                
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            raise Exception(f"Failed to delete task: {str(e)}")