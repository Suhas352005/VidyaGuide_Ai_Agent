from fastapi import APIRouter

from ..schemas import SkillGapAnalysis
from ..services import skill_gap_dummy


router = APIRouter(prefix="/evaluate", tags=["evaluation"])


@router.get("/skills", response_model=SkillGapAnalysis)
def evaluate_skills() -> SkillGapAnalysis:
    # Placeholder analysis based on dummy data
    return skill_gap_dummy()

