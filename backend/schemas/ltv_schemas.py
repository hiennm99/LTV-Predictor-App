from pydantic import BaseModel, Field
from typing import Optional, List


class DataInput(BaseModel):
    from_date: str
    to_date: str
    package_name: str
    country: Optional[str] = ""
    source: Optional[str] = ""
    campaign_name: Optional[str] = ""

class PermissionInput(BaseModel):
    username: str

class GameInput(BaseModel):
    view_all: bool
    games_list: List[str] = Field(default_factory=list)