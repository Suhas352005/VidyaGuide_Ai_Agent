from fastapi import APIRouter

from ..schemas import JobRecommendation
from ..services import dummy_job_recommendations


router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/recommendations", response_model=list[JobRecommendation])
def get_recommendations() -> list[JobRecommendation]:
    return dummy_job_recommendations()

