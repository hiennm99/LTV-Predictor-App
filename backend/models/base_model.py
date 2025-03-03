from sqlalchemy import Column, Integer
from sqlalchemy.orm import declared_attr, as_declarative


@as_declarative()
class Base:
    id = Column(Integer, primary_key=True, index=True)

    @declared_attr
    def __tablename__(cls) -> str:
        return getattr(cls, "CustomTableName", cls.__name__.lower())
