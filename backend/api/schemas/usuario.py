from typing import Optional
from pydantic import BaseModel, UUID4

class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str
    
    class Config:
        from_attributes = True

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    senha: Optional[str] = None
    
    class Config:
        from_attributes = True

class UsuarioRead(BaseModel):
    id: UUID4
    nome: str
    email: str