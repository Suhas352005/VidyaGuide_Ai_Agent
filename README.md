<<<<<<< HEAD
## VidyaMitra – AI-Powered Career Agent

Vidyamitra is an AI-powered career guidance platform that helps students and professionals
evaluate resumes, identify skill gaps, generate personalized training plans, simulate interviews,
and track learning progress.

This repository contains a **FastAPI** backend and a **React + TypeScript + Vite + Tailwind CSS**
frontend, following the architecture described in your project document.

### Project structure

- `backend/` – FastAPI application (APIs, AI integrations, database layer)
- `web/` – React frontend (dashboard, resume upload, quizzes, interviews, progress tracking)

### High-level features (scaffolded)

- User authentication (register, login – basic demo implementation)
- Resume upload & parsing endpoint (stubbed, ready for OpenAI integration)
- Skill evaluation & training-plan generation endpoints (stubbed)
- Quiz and mock interview endpoints (stubbed)
- Job recommendation and progress tracking endpoints (stubbed)
- React dashboard with pages for:
  - Login / Register
  - Resume upload & analysis flow
  - Job/domain selection
  - Training plan
  - Quiz
  - Interview
  - Progress & jobs

### Getting started (quick view)

1. Install **Python 3.10+** and **Node.js 18+** if not already installed.
2. Backend:
   - `cd backend`
   - Create virtual env: `python -m venv .venv` (Windows)  
   - Activate: `.venv\Scripts\activate`
   - `pip install -r requirements.txt`
   - Create `.env` from `.env.example`
   - Run: `uvicorn app.main:app --reload`
3. Frontend:
   - `cd web`
   - `npm install`
   - Create `.env` from `.env.example`
   - Run: `npm run dev`

Detailed instructions and configuration live in each subfolder.

=======
# VidyaGuide_Ai_Agent
>>>>>>> 6f14beb6192dbafc99f42412e18d416a73a32eeb
