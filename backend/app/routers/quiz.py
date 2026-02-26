import uuid
from fastapi import APIRouter

from ..schemas import (
    QuizStartRequest,
    QuizStartResponse,
    QuizSubmitRequest,
    QuizResult,
)
from ..services import dummy_quiz_questions, evaluate_quiz_dummy


router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/start", response_model=QuizStartResponse)
def start_quiz(payload: QuizStartRequest) -> QuizStartResponse:
    quiz_id = str(uuid.uuid4())
    questions = dummy_quiz_questions(payload.num_questions)
    return QuizStartResponse(quiz_id=quiz_id, questions=questions)


@router.post("/submit", response_model=QuizResult)
def submit_quiz(payload: QuizSubmitRequest) -> QuizResult:
    return evaluate_quiz_dummy(payload.answers)

