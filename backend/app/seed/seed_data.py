import datetime
from app.database.session import SessionLocal, engine, Base
from app.models.meeting import Meeting

def seed_db():
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have meetings
    if db.query(Meeting).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database...")
    
    now = datetime.datetime.utcnow()
    
    # Sample meetings
    meetings = [
        Meeting(
            meeting_id="instant-demo",
            title="Daily Standup Call",
            description="Quick sync to discuss project updates, blockers, and next steps.",
            start_time=now + datetime.timedelta(minutes=30),
            duration=15,
            type="scheduled",
            host_name="Alex Johnson",
            is_active=True
        ),
        Meeting(
            meeting_id="design-review",
            title="Q3 UI/UX Design Review",
            description="Reviewing the new dashboard layout designs and gathering feedback.",
            start_time=now + datetime.timedelta(days=1, hours=2),
            duration=60,
            type="scheduled",
            host_name="Emily Davis",
            is_active=True
        ),
        Meeting(
            meeting_id="tech-sync",
            title="Frontend-Backend Integration",
            description="Collaborative session to wire up FastAPI endpoints with Next.js components.",
            start_time=now + datetime.timedelta(days=2),
            duration=45,
            type="scheduled",
            host_name="Sarah Miller",
            is_active=True
        )
    ]
    
    for meeting in meetings:
        db.add(meeting)
    
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
