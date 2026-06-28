from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    duration: int # in minutes
    type: str # "instant" or "scheduled"
    host_name: Optional[str] = "Guest Host"

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    id: int
    meeting_id: str
    is_active: bool

    class Config:
        from_attributes = True
