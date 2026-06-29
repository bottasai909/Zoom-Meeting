from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base
from app.routers import meeting_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Zoom Clone API",
    description="Backend API for the Zoom Clone application",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://10.204.212.85:3000",
    "http://10.204.212.85:3001",
    "https://zoom-meeting-43zodm6k0-rangers9.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meeting_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Zoom Clone API. Go to /docs for API documentation."}
