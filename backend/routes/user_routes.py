from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from models import User
from utils.auth import hash_pwd, check_pwd, create_access_token
from schemas.user_schemas import UserRegister, UserLogin
from configs.database import get_db
import json
import httpx
from datetime import timedelta


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
)

ALLOWED_DOMAIN = "reddotme.com"
GOOGLE_CLIENT_ID = "915902946640-pqt8tumdf4os14eg9f493ue201rp7t8u.apps.googleusercontent.com"

@router.post("/register")
async def register(user: UserRegister, db: Session = Depends(get_db)):
    # Kiểm tra người dùng đã tồn tại
    existing_user = db.query(User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    db_user = User(
        email=user.email, # type: ignore
        hashed_pwd=hash_pwd(user.password), # type: ignore
        first_name=user.first_name, # type: ignore
        last_name=user.last_name, # type: ignore
        department=user.department, # type: ignore
        description=user.description, # type: ignore
    )
    db.add(db_user)
    db.commit()

    return {"message": "User registered successfully"}

@router.post(f'/login')
async def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter_by(email=user.email).first()
    if existing_user:
        existing_user.first_name
        hashed_pwd = existing_user.hashed_pwd
        is_correct = check_pwd(password_input=user.password, hashed=hashed_pwd) # type: ignore

        if is_correct:
            return {
                "token": "abcxyz123456789",
                "first_name": existing_user.first_name,
                "last_name": existing_user.last_name,
                "department": existing_user.department
                }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    else:
        raise HTTPException(status_code=400, detail="User not found")
    
@router.post(f'/pwd/change')
async def change_pwd(request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    try:
        user = json.loads(body.decode('utf-8'))
    except UnicodeDecodeError:
        print("Body không thể chuyển thành chuỗi")

    # Check if user already exists
    existing_user = db.session.query(User).filter_by(email=user.get('email')).first()
    if existing_user:
        # Lấy mật khẩu đã băm từ cơ sở dữ liệu (dạng str)
        hashed_pwd = existing_user.hashed_pwd

        # Kiểm tra mật khẩu người dùng nhập vào
        is_correct = check_pwd(password_input=user.get('current_password'), hashed=hashed_pwd)

        if is_correct:
            new_password = user.get('new_password')
            new_hashed_pwd = hash_pwd(new_password)
            existing_user.hashed_pwd = new_hashed_pwd
            db.session.commit()
            return {"detail": "Change password successfully"}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    else:
        raise HTTPException(status_code=400, detail="User not found")
    
@router.post(f'/auth/reset')
async def reset_pwd(request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    try:
        user = json.loads(body.decode('utf-8'))
    except UnicodeDecodeError:
        print("Body không thể chuyển thành chuỗi")

    # Check if user already exists
    existing_user = db.session.query(User).filter_by(email=user.get('email')).first()
    if existing_user:
        new_password = user.get('new_password')
        if not new_password:
            raise HTTPException(status_code=400, detail="New password is required")
        
        new_hashed_pwd = hash_pwd(new_password)
        existing_user.hashed_pwd = new_hashed_pwd
        db.session.commit()
        
        return {"detail": "Reset password successfully"}


@router.post('/google')
async def sign_in_google(request: Request, db: Session = Depends(get_db)):
    """
    Xử lý đăng nhập bằng Google OAuth 2.0
    """
    body = await request.json()
    google_token = body.get("token")

    if not google_token:
        raise HTTPException(status_code=400, detail="Google token is required")

    user_info_url = "https://www.googleapis.com/oauth2/v3/tokeninfo"
    async with httpx.AsyncClient() as client:
        response = await client.get(user_info_url, params={"id_token": google_token})

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    google_user = response.json()
    email = google_user.get("email")
    domain = email.split("@")[-1]

    if not email:
        raise HTTPException(status_code=400, detail="No email found in Google account")
    
    if domain != ALLOWED_DOMAIN:
        raise HTTPException(status_code=403, detail="Unauthorized domain")

    access_token, expired_time = create_access_token({"sub": email}, timedelta(days=1))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": email,
        "first_name": google_user.get("given_name", ""),
        "last_name": google_user.get("family_name", ""),
        "isAuthenticated": True,
        "expired_time": expired_time,
        "picture": google_user.get("picture", "")
    }
