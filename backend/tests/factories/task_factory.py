import factory
from datetime import datetime, timedelta
from api.models.task import Tarefa, StatusTarefa, PrioridadeTarefa


class TaskFactory(factory.Factory):
    class Meta:
        model = Tarefa
    
    titulo = factory.Faker('sentence', nb_words=3)
    descricao = factory.Faker('paragraph', nb_sentences=2)
    status = factory.Iterator([StatusTarefa.PENDENTE, StatusTarefa.CONCLUIDA])
    prioridade = factory.Iterator([PrioridadeTarefa.BAIXA, PrioridadeTarefa.MEDIA, PrioridadeTarefa.ALTA])
    data_vencimento = factory.LazyFunction(lambda: datetime.now() + timedelta(days=7))
    usuario_id = factory.SubFactory('tests.factories.user_factory.UserFactory')
    
    @classmethod
    def create_pending(cls, **kwargs):
        """Create a pending task."""
        kwargs['status'] = StatusTarefa.PENDENTE
        return cls(**kwargs)
    
    @classmethod
    def create_completed(cls, **kwargs):
        """Create a completed task."""
        kwargs['status'] = StatusTarefa.CONCLUIDA
        return cls(**kwargs)
    
    @classmethod
    def create_high_priority(cls, **kwargs):
        """Create a high priority task."""
        kwargs['prioridade'] = PrioridadeTarefa.ALTA
        return cls(**kwargs) 