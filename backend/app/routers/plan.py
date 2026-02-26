from fastapi import APIRouter

from ..schemas import TrainingPlan
from ..services import training_plan_dummy


router = APIRouter(prefix="/plan", tags=["training"])


@router.get("/generate", response_model=TrainingPlan)
def generate_plan(goal_role: str = "Data Analyst") -> TrainingPlan:
    return training_plan_dummy(goal_role)

