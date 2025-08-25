from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum as SQLAlchemyEnum
from api.models.base import Base
from datetime import datetime
import uuid
from enum import Enum

class StatusTarefa(str, Enum):
    PENDENTE = "PENDENTE"
    CONCLUIDA = "CONCLUIDA"

class PrioridadeTarefa(str, Enum):
    BAIXA = "BAIXA"
    MEDIA = "MEDIA"
    ALTA = "ALTA"

class Tarefa(Base):
    __tablename__ = "tarefa"

    titulo: Mapped[str]
    descricao: Mapped[str]
    status: Mapped[StatusTarefa] = mapped_column(SQLAlchemyEnum(StatusTarefa, name="status_tarefa"))
    prioridade: Mapped[PrioridadeTarefa] = mapped_column(SQLAlchemyEnum(PrioridadeTarefa, name="prioridade_tarefa"))
    data_vencimento: Mapped[datetime]
    data_criacao: Mapped[datetime]
    data_atualizacao: Mapped[datetime]
    usuario_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("usuario.id"))

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="tarefas")
