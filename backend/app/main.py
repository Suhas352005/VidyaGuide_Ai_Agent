from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .config import get_settings
from .routers import auth, resume, evaluate, plan, quiz, interview, jobs, progress


settings = get_settings()

app = FastAPI()

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/favicon.ico")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(evaluate.router)
app.include_router(plan.router)
app.include_router(quiz.router)
app.include_router(interview.router)
app.include_router(jobs.router)
app.include_router(progress.router)


@app.get("/", tags=["health"])
def read_root() -> dict:
    return {"status": "ok", "message": "Vidyamitra API is running."}

