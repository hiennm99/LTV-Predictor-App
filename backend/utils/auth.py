import bcrypt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import time


SECRET_KEY = "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"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def hash_pwd(password: str) -> str:
    password_byte = password.encode("utf-8")  # Chuyển mật khẩu thành bytes
    salt = bcrypt.gensalt()  # Tạo salt
    hashed_password = bcrypt.hashpw(password_byte, salt)  # Hash mật khẩu
    return hashed_password.decode('utf-8')  # Trả về mật khẩu đã băm dưới dạng string


def check_pwd(password_input: str, hashed: str) -> bool:
    password_input_byte = password_input.encode('utf-8')  # Chuyển password_input thành bytes
    hashed_byte = hashed.encode('utf-8')  # Chuyển hashed thành bytes
    return bcrypt.checkpw(password_input_byte, hashed_byte)  # So sánh mật khẩu


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM), expire

def verify_token(token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("exp") < int(time.time()):
            raise HTTPException(status_code=401, detail="Token expired")
        return payload  # Trả về payload nếu token hợp lệ
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")