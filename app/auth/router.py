from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from pydantic import BaseModel

from config import get_settings
from auth.utils import verify_password, create_access_token, hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])
settings = get_settings()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PasswordHashRequest(BaseModel):
    password: str


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Admin login. Returns a JWT token.
    Use this token in Authorization: Bearer <token> header for admin routes.

    First time setup:
    1. Call POST /auth/hash-password with your chosen password
    2. Copy the hash into your .env as ADMIN_PASSWORD=<hash>
    """
    if form_data.username != settings.ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    if not verify_password(form_data.password, settings.ADMIN_PASSWORD):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = create_access_token(data={"sub": form_data.username})
    return TokenResponse(access_token=token)


@router.post("/hash-password")
def hash_password_util(body: PasswordHashRequest):
    """
    Utility endpoint to generate a bcrypt hash of your password.
    Use this ONCE to set up your admin password, then remove or protect this endpoint.
    """
    return {"hashed_password": hash_password(body.password)}
