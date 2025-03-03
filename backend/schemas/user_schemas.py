from pydantic import BaseModel
from typing import Optional  # Import Optional từ typing

class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    department: str
    description: str = ""

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True

class UserData(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    department: str
    description: str

    class Config:
        from_attributes = True

class UserResetPassword(BaseModel):
    email: str
    password: str
    new_password: str

    class Config:
        from_attributes = True

