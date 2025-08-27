from fastapi import APIRouter, Depends, status, HTTPException

from api.core.dependencies import T_CurrentUser, T_Session, T_TaskDeps
from api.core.response_model import SingleResponse, PaginatedResponse
from api.core.security import get_current_user

from api.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tarefas", tags=["Tarefas"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=PaginatedResponse[TaskRead])
async def get_all(db: T_Session, current_user: T_CurrentUser, deps: T_TaskDeps, skip: int = 0, limit: int = 100):
    items, total = deps.task_service.list_tasks(current_user.id, skip, limit)
    return {"total": total, "data": items}

@router.get("/{id}", response_model=SingleResponse[TaskRead])
async def get_by_id(id: str, db: T_Session, deps: T_TaskDeps, current_user: T_CurrentUser):
    item = deps.task_service.get_task_by_id(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return {"data": [item]}

@router.post("/", response_model=SingleResponse[TaskRead], status_code=status.HTTP_201_CREATED)
async def create(data: TaskCreate, db: T_Session, deps: T_TaskDeps, current_user: T_CurrentUser):
    try:
        task = deps.task_service.create_task(data, current_user.id)
        if not task:
            raise HTTPException(status_code=500, detail="Falha ao criar tarefa")
        return {"data": [task]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.patch("/{id}", response_model=SingleResponse[TaskRead])
async def update(id: str, data: TaskUpdate, db: T_Session, deps: T_TaskDeps, current_user: T_CurrentUser):
    task = deps.task_service.update_task(id, data, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return {"data": [task]}

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(id: str, db: T_Session, deps: T_TaskDeps, current_user: T_CurrentUser):
    deps.task_service.delete_task(id, current_user.id)