from fastapi import APIRouter

from ..schemas import ProgressOverview
from ..services import dummy_progress_overview


router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/", response_model=ProgressOverview)
def get_progress() -> ProgressOverview:
    return dummy_progress_overview()

