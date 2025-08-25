from starlette import status
from fastapi import APIRouter

from api.core.security import T_OAuth2Form
from api.core.dependencies import T_ContaDeps, T_CurrentUser

from api.schemas.usuario import UsuarioCreate, UsuarioRead

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

@router.post('/register', status_code=status.HTTP_201_CREATED)
async def create_user(user: UsuarioCreate, deps: T_ContaDeps):
    return deps.conta_service.register(user)

@router.post("/login", status_code=status.HTTP_200_OK)
async def user_login(form_data: T_OAuth2Form, deps: T_ContaDeps):
    return deps.conta_service.login(form_data)

@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_token(current_user: T_CurrentUser, deps: T_ContaDeps):
    return deps.conta_service.refresh_token(current_user)

@router.get(
    "/me", 
    status_code=status.HTTP_200_OK,
    response_model=UsuarioRead,
)
async def get_me(current_user: T_CurrentUser, deps: T_ContaDeps):
    return deps.conta_service.get_me(current_user.id)