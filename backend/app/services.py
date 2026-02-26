from datetime import datetime, timedelta
from typing import List

from .config import get_settings
from .schemas import (
    ResumeAnalysis,
    SkillGapAnalysis,
    TrainingPlan,
    TrainingPlanItem,
    QuizQuestion,
    QuizResult,
    InterviewQuestion,
    InterviewFeedback,
    JobRecommendation,
    ProgressEntry,
    ProgressOverview,
)


settings = get_settings()


def analyze_resume_dummy(text: str) -> ResumeAnalysis:
    # This is a safe, offline-friendly placeholder implementation.
    # Replace with real OpenAI / LangChain logic once API keys are configured.
    return ResumeAnalysis(
        summary="AI analysis placeholder for uploaded resume.",
        strengths=[
            "Clear structure",
            "Relevant academic background",
        ],
        improvements=[
            "Add measurable achievements",
            "Include more keywords for target roles",
        ],
        suggested_skills=[
            "Data Visualization",
            "Cloud Fundamentals",
            "SQL",
        ],
    )


def skill_gap_dummy() -> SkillGapAnalysis:
    return SkillGapAnalysis(
        current_skills=["Python", "HTML", "CSS"],
        missing_skills=["React", "FastAPI", "Docker"],
        recommended_courses=[
            "Full-Stack Web Development with React and FastAPI",
            "Docker Essentials for Developers",
        ],
    )


def training_plan_dummy(goal_role: str) -> TrainingPlan:
    items: List[TrainingPlanItem] = [
        TrainingPlanItem(
            skill="React Basics",
            resource_title="React Official Tutorial",
            resource_type="video",
            url="https://react.dev/learn",
            estimated_hours=6,
        ),
        TrainingPlanItem(
            skill="FastAPI",
            resource_title="FastAPI Crash Course",
            resource_type="video",
            url="https://fastapi.tiangolo.com/",
            estimated_hours=5,
        ),
        TrainingPlanItem(
            skill="SQL & Supabase",
            resource_title="Supabase Docs – Getting Started",
            resource_type="docs",
            url="https://supabase.com/docs",
            estimated_hours=4,
        ),
    ]
    return TrainingPlan(goal_role=goal_role, items=items)


def dummy_quiz_questions(num: int) -> List[QuizQuestion]:
    base_questions = [
        QuizQuestion(
            id=1,
            question="Which HTTP method is typically used to retrieve data?",
            options=["POST", "GET", "PUT", "DELETE"],
            correct_index=1,
        ),
        QuizQuestion(
            id=2,
            question="Which hook is used to manage local state in React?",
            options=["useEffect", "useRouter", "useState", "useMemo"],
            correct_index=2,
        ),
        QuizQuestion(
            id=3,
            question="FastAPI is built on top of which ASGI framework?",
            options=["Flask", "Starlette", "Django", "Tornado"],
            correct_index=1,
        ),
        QuizQuestion(
            id=4,
            question="Which database does Supabase use internally?",
            options=["MySQL", "MongoDB", "PostgreSQL", "SQLite"],
            correct_index=2,
        ),
        QuizQuestion(
            id=5,
            question="What does CORS stand for?",
            options=[
                "Cross-Origin Resource Sharing",
                "Cross-Origin Request Service",
                "Centralized Origin Resource Service",
                "Cloud-Origin Resource Sharing",
            ],
            correct_index=0,
        ),
    ]
    return base_questions[:num]


def evaluate_quiz_dummy(answers: list[int]) -> QuizResult:
    # Score answers against the deterministic dummy questions.
    questions = dummy_quiz_questions(len(answers))
    total = len(questions)
    score = 0
    for idx, q in enumerate(questions):
        if idx < len(answers) and answers[idx] == q.correct_index:
            score += 1

    if score == total:
        feedback = "Excellent – you got everything right. Try a harder difficulty next time."
    elif score == 0:
        feedback = (
            "This attempt did not score, which is okay. Review the explanations and try again."
        )
    else:
        feedback = (
            "Good effort. Review the questions you missed and re-take the quiz to improve."
        )

    return QuizResult(score=score, total=total, feedback=feedback)


def dummy_interview_questions(job_role: str) -> list[InterviewQuestion]:
    return [
        InterviewQuestion(
            id=1,
            question=f"Tell me about a project where you used {job_role}-related skills.",
        ),
        InterviewQuestion(
            id=2,
            question=f"What are the most important skills for a successful {job_role}?",
        ),
    ]


def evaluate_interview_answer_dummy(answer: str) -> InterviewFeedback:
    return InterviewFeedback(
        score=8,
        strengths=["Clear communication", "Relevant examples"],
        improvements=["Add more measurable outcomes", "Highlight specific tools used"],
        overall_feedback="Strong response. Focus on quantifying your impact.",
    )


def dummy_job_recommendations() -> list[JobRecommendation]:
    return [
        JobRecommendation(
            title="Junior Data Analyst",
            company="Insight Analytics",
            location="Remote",
            url="https://example.com/jobs/data-analyst",
            match_score=87,
        ),
        JobRecommendation(
            title="Full-Stack Developer (React/FastAPI)",
            company="TechBridge Solutions",
            location="Bangalore, IN",
            url="https://example.com/jobs/fullstack",
            match_score=82,
        ),
    ]


def dummy_progress_overview() -> ProgressOverview:
    today = datetime.utcnow().date()
    quiz_scores = [
        ProgressEntry(
            date=datetime.combine(today - timedelta(days=7 * i), datetime.min.time()),
            metric="quiz_score",
            value=70 + i * 5,
            label=f"Weekly quiz {i+1}",
        )
        for i in range(3)
    ]
    interview_scores = [
        ProgressEntry(
            date=datetime.combine(today - timedelta(days=14 * i), datetime.min.time()),
            metric="interview_score",
            value=60 + i * 10,
            label=f"Mock interview {i+1}",
        )
        for i in range(2)
    ]
    return ProgressOverview(
        quiz_scores=quiz_scores,
        interview_scores=interview_scores,
        completed_skills=["Python", "SQL Basics", "Git Fundamentals"],
    )

