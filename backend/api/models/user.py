from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from api.models.base import Base

class Usuario(Base):
    __tablename__ = "usuario"

    nome: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    senha: Mapped[str]
    
    tarefas: Mapped[List["Tarefa"]] = relationship("Tarefa", back_populates="usuario")