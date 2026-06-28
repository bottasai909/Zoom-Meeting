from sqlalchemy import Column, String, Integer, DateTime, Boolean
from app.database.session import Base
import datetime

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, unique=True, index=True) # e.g. "abc-defg-hij" or "instant-123"
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    duration = Column(Integer, default=30) # in minutes
    type = Column(String) # "instant", "scheduled"
    host_name = Column(String, default="Guest Host")
    is_active = Column(Boolean, default=True)
