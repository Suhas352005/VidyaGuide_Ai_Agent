from fastapi import APIRouter, File, UploadFile, HTTPException

from ..schemas import ResumeAnalysis
from ..services import analyze_resume_dummy


router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/parse", response_model=ResumeAnalysis)
async def parse_resume(file: UploadFile = File(...)) -> ResumeAnalysis:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file.")

    text_sample = content.decode(errors="ignore")[:4000]
    return analyze_resume_dummy(text_sample)

