from fastapi import APIRouter, HTTPException

from ..schemas import UserRegister, UserLogin, AuthResponse


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
def register_user(payload: UserRegister) -> AuthResponse:
    # Demo-only: no real database or password hashing.
    # In a real app, you would hash the password and store the user.
    if not payload.password or len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    fake_token = "demo-register-token"
    return AuthResponse(access_token=fake_token, user_email=payload.email)


@router.post("/login", response_model=AuthResponse)
def login_user(payload: UserLogin) -> AuthResponse:
    # Demo-only: accept any email/password combination.
    fake_token = "demo-login-token"
    return AuthResponse(access_token=fake_token, user_email=payload.email)

