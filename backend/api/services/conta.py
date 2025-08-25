from passlib.context import CryptContext

from api.core.security import create_access_token
from api.core.exceptions import ExceptionBadRequest
from api.core.decorators import handle_sqlalchemy_errors

from api.models.user import Usuario
from api.repositories.usuario import UsuarioRepository
from api.services.usuario import UsuarioService

from api.schemas.conta import UsuarioLogin, Token
from api.schemas.usuario import UsuarioCreate


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ContaService:
    def __init__(self, user_repository: UsuarioRepository, user_services: UsuarioService):
        self.user_repository = user_repository
        self.user_services = user_services

    @handle_sqlalchemy_errors   
    def register(self, obj: UsuarioCreate) -> Usuario:
        return self.user_services.create_user(obj)

    @handle_sqlalchemy_errors
    def login(self, obj: UsuarioLogin):
        usuario = self.user_services.get_user_by_email(obj.username)
        if not usuario:
            raise ExceptionBadRequest("Credenciais inválidas")
        if not pwd_context.verify(obj.password, usuario.senha):
            raise ExceptionBadRequest("Credenciais inválidas")
        access_token = create_access_token(data={"sub": usuario.email})
        return Token(access_token=access_token, token_type="Bearer")
    
    def refresh_token(self, current_user: Usuario):
        access_token = create_access_token(data={"sub": current_user.email})
        return Token(access_token=access_token, token_type="Bearer")
    
    @handle_sqlalchemy_errors
    def get_me(self, id: str) -> Usuario:
        return self.user_services.get_user_by_id(id)