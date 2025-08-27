from fastapi import APIRouter

from . import auth, usuario, task

router = APIRouter()

router.include_router(auth.router)
router.include_router(usuario.router)
router.include_router(task.router)