from fastapi import APIRouter

from api.routes import auth, usuario

router = APIRouter()

router.include_router(auth.router)
router.include_router(usuario.router)
