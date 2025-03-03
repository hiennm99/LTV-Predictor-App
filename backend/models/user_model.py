from sqlalchemy import Column, String
from models.base_model import Base


class User(Base):
    email = Column(String(255), unique=True, nullable=False)
    hashed_pwd = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=True)
    description = Column(String(500), nullable=True)