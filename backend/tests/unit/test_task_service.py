from datetime import datetime, timedelta
from tests.factories.task_factory import TaskFactory
from tests.factories.user_factory import UserFactory
from api.models.task import StatusTarefa, PrioridadeTarefa


class TestTaskService:
    """Test task service functions."""
    
    def test_create_task(self, db_session):
        """Test task creation."""
        # Create a test user
        user = UserFactory()
        db_session.add(user)
        db_session.commit()
        
        # Create task data
        task_data = {
            "titulo": "Test Task",
            "descricao": "Test Description",
            "status": StatusTarefa.PENDENTE,
            "prioridade": PrioridadeTarefa.MEDIA,
            "data_vencimento": datetime.now() + timedelta(days=7),
            "usuario_id": user.id
        }
        
        # Create task
        task = TaskFactory(**task_data)
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)
        
        # Assertions
        assert task.id is not None
        assert task.titulo == task_data["titulo"]
        assert task.descricao == task_data["descricao"]
        assert task.status == task_data["status"]
        assert task.prioridade == task_data["prioridade"]
        assert task.usuario_id == user.id
    
    def test_get_user_tasks(self, db_session, test_user):
        """Test getting tasks for a specific user."""
        # Create multiple tasks for the user
        task1 = TaskFactory(usuario_id=test_user.id)
        task2 = TaskFactory(usuario_id=test_user.id)
        task3 = TaskFactory(usuario_id=test_user.id)
        
        db_session.add_all([task1, task2, task3])
        db_session.commit()
        
        # Get tasks for the user
        tasks = db_session.query(TaskFactory._meta.model).filter(
            TaskFactory._meta.model.usuario_id == test_user.id
        ).all()
        
        # Assertions
        assert len(tasks) == 3
        assert all(task.usuario_id == test_user.id for task in tasks)
    
    def test_update_task(self, db_session, test_task):
        """Test task update."""
        # Update task data
        new_title = "Updated Task Title"
        new_description = "Updated Description"
        new_status = StatusTarefa.CONCLUIDA
        
        test_task.titulo = new_title
        test_task.descricao = new_description
        test_task.status = new_status
        
        db_session.commit()
        db_session.refresh(test_task)
        
        # Assertions
        assert test_task.titulo == new_title
        assert test_task.descricao == new_description
        assert test_task.status == new_status
    
    def test_delete_task(self, db_session, test_task):
        """Test task deletion."""
        task_id = test_task.id
        
        # Delete task
        db_session.delete(test_task)
        db_session.commit()
        
        # Try to find the deleted task
        deleted_task = db_session.query(TaskFactory._meta.model).filter(
            TaskFactory._meta.model.id == task_id
        ).first()
        
        # Assertions
        assert deleted_task is None
    
    def test_task_status_transition(self, db_session, test_user):
        """Test task status transitions."""
        # Create a task with specific status
        task = TaskFactory(usuario_id=test_user.id, status=StatusTarefa.PENDENTE)
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)
        
        # Initial status should be PENDENTE
        assert task.status == StatusTarefa.PENDENTE
        
        # Change to CONCLUIDA
        task.status = StatusTarefa.CONCLUIDA
        db_session.commit()
        db_session.refresh(task)
        
        # Assertions
        assert task.status == StatusTarefa.CONCLUIDA
    
    def test_task_priority_validation(self, db_session, test_user):
        """Test task priority validation."""
        # Valid priorities
        valid_priorities = [PrioridadeTarefa.BAIXA, PrioridadeTarefa.MEDIA, PrioridadeTarefa.ALTA]
        
        for priority in valid_priorities:
            task = TaskFactory(usuario_id=test_user.id, prioridade=priority)
            db_session.add(task)
            db_session.commit()
            db_session.refresh(task)
            
            assert task.prioridade == priority
    
    def test_task_due_date_validation(self, db_session, test_user):
        """Test task due date validation."""
        # Future date
        future_date = datetime.now() + timedelta(days=30)
        task = TaskFactory(usuario_id=test_user.id, data_vencimento=future_date)
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)
        
        assert task.data_vencimento == future_date
        
        # Past date (should also be valid for flexibility)
        past_date = datetime.now() - timedelta(days=1)
        task2 = TaskFactory(usuario_id=test_user.id, data_vencimento=past_date)
        db_session.add(task2)
        db_session.commit()
        db_session.refresh(task2)
        
        assert task2.data_vencimento == past_date 