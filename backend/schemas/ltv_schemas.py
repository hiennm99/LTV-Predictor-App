from pydantic import BaseModel
from typing import Optional


class DataInput(BaseModel):
    from_date: str
    to_date: str
    package_name: str
    country: Optional[str] = ""
    source: Optional[str] = ""
    campaign_name: Optional[str] = ""