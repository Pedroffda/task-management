from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

from api.core.db_conection import get_db
from api.core.security import get_current_user
from api.models.user import Usuario
from api.services.usuario import UsuarioService
from api.repositories.usuario import UsuarioRepository
from api.repositories.conta import ContaRepository
from api.services.conta import ContaService


T_Session = Annotated[Session, Depends(get_db)]
T_CurrentUser = Annotated[Usuario, Depends(get_current_user)]

class UsuarioDependencies:
    def __init__(self, db: T_Session):
        self.repository = UsuarioRepository(db)
        self.service = UsuarioService(self.repository)

def get_usuario_deps(db: T_Session) -> UsuarioDependencies:
    return UsuarioDependencies(db)

T_UsuarioDeps = Annotated[UsuarioDependencies, Depends(get_usuario_deps)]

class ContaDependencies:
    def __init__(self, db: T_Session):
        self.conta_repository = ContaRepository(db)
        self.usuario_repository = UsuarioRepository(db)
        self.usuario_service = UsuarioService(self.usuario_repository)
        self.conta_service = ContaService(self.conta_repository, self.usuario_service)
        
def get_conta_deps(db: T_Session) -> ContaDependencies:
    return ContaDependencies(db)

T_ContaDeps = Annotated[ContaDependencies, Depends(get_conta_deps)]