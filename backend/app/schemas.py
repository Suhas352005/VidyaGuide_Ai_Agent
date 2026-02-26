from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import List, Optional


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_email: EmailStr


class ResumeAnalysis(BaseModel):
    summary: str
    strengths: List[str]
    improvements: List[str]
    suggested_skills: List[str]


class SkillGapAnalysis(BaseModel):
    current_skills: List[str]
    missing_skills: List[str]
    recommended_courses: List[str]


class TrainingPlanItem(BaseModel):
    skill: str
    resource_title: str
    resource_type: str
    url: str
    estimated_hours: int


class TrainingPlan(BaseModel):
    goal_role: str
    items: List[TrainingPlanItem]


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_index: int


class QuizStartRequest(BaseModel):
    domain: str
    difficulty: str
    num_questions: int = 5


class QuizStartResponse(BaseModel):
    quiz_id: str
    questions: List[QuizQuestion]


class QuizSubmitRequest(BaseModel):
    quiz_id: str
    answers: List[int]


class QuizResult(BaseModel):
    score: int
    total: int
    feedback: str


class InterviewStartRequest(BaseModel):
    job_role: str
    experience_years: int


class InterviewQuestion(BaseModel):
    id: int
    question: str


class InterviewStartResponse(BaseModel):
    session_id: str
    questions: List[InterviewQuestion]


class InterviewAnswerRequest(BaseModel):
    session_id: str
    question_id: int
    answer: str


class InterviewFeedback(BaseModel):
    score: int
    strengths: List[str]
    improvements: List[str]
    overall_feedback: str


class JobRecommendation(BaseModel):
    title: str
    company: str
    location: str
    url: str
    match_score: int


class ProgressEntry(BaseModel):
    date: datetime
    metric: str
    value: float
    label: str


class ProgressOverview(BaseModel):
    quiz_scores: List[ProgressEntry]
    interview_scores: List[ProgressEntry]
    completed_skills: List[str]

