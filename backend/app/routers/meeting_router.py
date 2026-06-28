from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import uuid
import datetime

from app.database.session import get_db
from app.models.meeting import Meeting
from app.schemas.meeting_schema import MeetingCreate, MeetingResponse

router = APIRouter(
    prefix="/api/meetings",
    tags=["meetings"]
)

# Request schema for joining a meeting
class JoinMeetingRequest(BaseModel):
    display_name: str

# Helper function to generate a Zoom-like meeting ID (e.g. abc-defg-hij)
def generate_meeting_id():
    raw_id = str(uuid.uuid4()).replace("-", "")
    return f"{raw_id[:3]}-{raw_id[3:7]}-{raw_id[7:10]}"

@router.get("/upcoming", response_model=List[MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    # Fetch active meetings scheduled for the future or currently happening (e.g. started within last 2 hours)
    now = datetime.datetime.utcnow()
    two_hours_ago = now - datetime.timedelta(hours=2)
    
    meetings = db.query(Meeting).filter(
        Meeting.is_active == True,
        Meeting.start_time >= two_hours_ago
    ).order_by(Meeting.start_time.asc()).all()
    
    return meetings

@router.get("/recent", response_model=List[MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db)):
    # Fetch inactive meetings or meetings that have already ended
    now = datetime.datetime.utcnow()
    meetings = db.query(Meeting).filter(
        (Meeting.is_active == False) |
        (Meeting.start_time < now - datetime.timedelta(minutes=60))
    ).order_by(Meeting.start_time.desc()).limit(5).all()
    
    return meetings

@router.post("/create", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(meeting_in: MeetingCreate, db: Session = Depends(get_db)):
    meeting_id = generate_meeting_id()
    
    db_meeting = Meeting(
        meeting_id=meeting_id,
        title=meeting_in.title,
        description=meeting_in.description,
        start_time=meeting_in.start_time,
        duration=meeting_in.duration,
        type=meeting_in.type,
        host_name=meeting_in.host_name,
        is_active=True
    )
    
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@router.post("/join/{meeting_id}", response_model=MeetingResponse)
def join_meeting(meeting_id: str, request: JoinMeetingRequest, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if not meeting.is_active:
        raise HTTPException(status_code=400, detail="Meeting has already ended")
    return meeting

@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@router.get("/{meeting_id}/participants")
def get_participants(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    # Return the host and some mock participants to make the room look active
    return [
        {"display_name": meeting.host_name, "joined_at": meeting.start_time.isoformat()},
        {"display_name": "Jane Doe (Mock)", "joined_at": meeting.start_time.isoformat()},
        {"display_name": "Alex Smith (Mock)", "joined_at": meeting.start_time.isoformat()}
    ]

@router.post("/{meeting_id}/end")
def end_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    meeting.is_active = False
    db.commit()
    return {"status": "success", "message": "Meeting ended"}
