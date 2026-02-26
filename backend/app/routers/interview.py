import uuid
from fastapi import APIRouter

from ..schemas import (
    InterviewStartRequest,
    InterviewStartResponse,
    InterviewAnswerRequest,
    InterviewFeedback,
)
from ..services import dummy_interview_questions, evaluate_interview_answer_dummy


router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/start", response_model=InterviewStartResponse)
def start_interview(payload: InterviewStartRequest) -> InterviewStartResponse:
    session_id = str(uuid.uuid4())
    questions = dummy_interview_questions(payload.job_role)
    return InterviewStartResponse(session_id=session_id, questions=questions)


@router.post("/answer", response_model=InterviewFeedback)
def answer_question(payload: InterviewAnswerRequest) -> InterviewFeedback:
    # For now we ignore session and question ids in the dummy implementation.
    return evaluate_interview_answer_dummy(payload.answer)

