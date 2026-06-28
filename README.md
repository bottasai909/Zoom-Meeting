# Zoom Clone - Full-Stack Video Conferencing Platform

A functional full-stack video conferencing web application clone of the Zoom web app. This application replicates Zoom’s design, user experience, and core meeting workflows, including creating, scheduling, and joining meetings.

---

## 🚀 Features Implemented

### 1. Landing Dashboard
* **Zoom-inspired Dark Theme**: Built with custom HSL dark palettes matching Zoom’s modern web UI.
* **Navigation & Sidebar**: Full navigation sidebar to toggle between pages.
* **Quick Action Buttons**:
  * **New Meeting**: Instantly launch a meeting room.
  * **Join**: Enter a room using a Meeting ID.
  * **Schedule**: Plan future meetings.
* **Upcoming Scheduled Meetings**: Real-time list of upcoming sessions fetched from the database.
* **Recent Meetings Section**: Display of past/completed meetings.

### 2. Instant & Scheduled Meetings
* **Auto-generated Meeting IDs**: Generates unique Zoom-like IDs (e.g., `abc-defg-hij`).
* **Shareable Invite Links**: Copy one-click invite links directly from the meeting room or card.
* **Detailed Scheduling**: Support for **Title**, **Description**, **Date & Time**, and **Duration** (15m to 2h).

### 3. Interactive Meeting Room
* **Media Stream Controls**: Toggle Microphone (mute/unmute) and Camera (on/off) states.
* **Security & Fallbacks**: Graceful handling of browser camera permissions on non-localhost/insecure HTTP contexts.
* **Real-time Chat**: In-meeting text chat drawer.
* **Participants List**: Side panel showing active participants in the call.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js (React 19, Pages Router), Tailwind CSS v4, Lucide React (Icons).
* **Backend**: Python 3.12+, FastAPI (ASGI Framework).
* **Database**: SQLite (SQLAlchemy ORM).

---

## 🗄️ Database Design (SQLite)

The database schema is designed using SQLAlchemy ORM for clean separation of concerns and type safety. 

### `meetings` Table
| Column Name | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Indexed | Auto-incrementing unique record ID |
| `meeting_id` | String | Unique, Indexed | Human-readable Zoom-style ID (e.g. `abc-defg-hij`) |
| `title` | String | Indexed, Required | Topic of the meeting |
| `description` | String | Optional | Detailed description/agenda |
| `start_time` | DateTime | Required | Scheduled starting date and time (UTC) |
| `duration` | Integer | Default: 30 | Duration in minutes |
| `type` | String | Required | Meeting type: `"instant"` or `"scheduled"` |
| `host_name` | String | Default: `"Guest Host"` | Display name of the meeting host |
| `is_active` | Boolean | Default: `True` | Lifecycle state of the meeting |

---

## 🏁 Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **Python** (v3.10 or higher)

---

### 1. Backend Setup (FastAPI)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic
   ```
4. Seed the database with sample data:
   ```bash
   python -m app.seed.seed_data
   ```
5. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   * The API will be live at: `http://localhost:8000`
   * Interactive Docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup (Next.js)

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend/frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser:
   * **URL**: `http://localhost:3000`

---

## 🔒 Security Note on Media Devices
To test the webcam/mic controls inside the meeting room, please access the site via **`http://localhost:3000`**. Modern browsers restrict camera access (`getUserMedia`) to secure contexts (HTTPS or Localhost) and will block it on raw local network IP addresses (e.g., `http://10.x.x.x`).
