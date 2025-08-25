from typing import Optional
from datetime import datetime
from pydantic import BaseModel, UUID4
from api.models.task import StatusTarefa, PrioridadeTarefa

class TaskCreate(BaseModel):
    titulo: str
    descricao: str
    status: StatusTarefa
    prioridade: PrioridadeTarefa
    data_vencimento: datetime
    usuario_id: Optional[UUID4] = None
    
    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    status: Optional[StatusTarefa] = None
    prioridade: Optional[PrioridadeTarefa] = None
    data_vencimento: Optional[datetime] = None
    usuario_id: Optional[UUID4] = None
    
    class Config:
        from_attributes = True

class TaskRead(BaseModel):
    id: UUID4
    titulo: str
    descricao: str
    status: StatusTarefa
    prioridade: PrioridadeTarefa
    data_vencimento: datetime
    created_at: datetime
    updated_at: datetime
    usuario_id: UUID4