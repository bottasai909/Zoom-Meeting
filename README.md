# Zoom Clone - Full Stack Video Conferencing Platform

A production-inspired full-stack video conferencing platform that recreates the core meeting workflow of Zoom Web. The application enables users to create instant meetings, schedule future meetings, join meetings using unique meeting IDs, manage participants, and communicate through an integrated meeting interface.

The project demonstrates modern full-stack architecture using **Next.js**, **FastAPI**, and **SQLite**, following a clean separation between frontend, backend, and persistence layers.

---

# Table of Contents

* Overview
* Features
* Application Screenshots
* System Architecture
* Tech Stack
* Database Design
* Project Structure
* Backend Setup
* Frontend Setup
* API Overview
* Future Enhancements

---

# Overview

The application reproduces the essential workflow of modern video conferencing platforms.

Users can:

* Create instant meetings
* Schedule meetings
* Join meetings using Meeting IDs
* View upcoming meetings
* Access meeting history
* Share invitation links
* Manage microphone and camera
* Chat with participants
* View active participants

The application is designed with a responsive interface inspired by Zoom's web experience while maintaining a modular backend architecture.

---

# Features

## Dashboard

* Zoom-inspired dark interface
* Responsive layout
* Sidebar navigation
* Meeting statistics
* Upcoming meetings
* Recent meetings
* Quick action cards

---

## Instant Meetings

* One-click meeting creation
* Automatically generated meeting IDs
* Shareable meeting invitation links
* Direct meeting room access

---

## Scheduled Meetings

* Meeting title
* Description
* Date & Time selection
* Duration selection
* Upcoming meeting list
* Meeting lifecycle management

---

## Meeting Room

* Camera On / Off
* Microphone Mute / Unmute
* Participant sidebar
* Live meeting chat
* Meeting information panel
* Invite link sharing

---

## User Experience

* Responsive UI
* Modern dark theme
* Toast notifications
* Loading states
* Empty state handling
* Error handling
* Permission fallbacks for camera and microphone

---

# Application Screenshots

## Landing Dashboard

> Overview of the application after login showing quick meeting actions, scheduled meetings, and recent meetings.
>
> 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/83ff7231-f7b3-4576-b211-c58d12a4de44" />


---

## New Instant Meeting

Shows instant meeting creation with automatically generated meeting ID.



``

## Schedule Meeting

Meeting scheduling interface including title, description, date, time, and duration.


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/df2c41de-93f1-4eb3-9611-312a05b4e930" />


## Upcoming Meetings

Displays meetings retrieved from the backend database.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/99710f3a-4a71-4bf3-ad22-4d47f7a90bb8" />

```

---

## Join Meeting

Meeting join page using Meeting ID.

```
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/51cef609-74fb-4ca8-9df7-fe305d227367" />

```

---

## Meeting Room

Interactive meeting room with media controls.

Visible features:

* Camera Toggle
* Microphone Toggle
* Meeting Information
* Invite Button
* Active Participants

```
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cb86afe9-a7ae-4f11-a62d-07336d487e92" />

```

---

## In-Meeting Chat

Real-time chat drawer inside the meeting room.

```
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/42d4a9ee-2c85-4bf8-8bd1-7bb8ea551cb1" />

```

---

## Participants Panel

Displays active participants currently connected.

```
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9079b6be-7f6f-46ff-b82c-a532798d13ec" />

```

---

# System Architecture

```
                    Next.js Frontend
                          │
               REST API (HTTP/JSON)
                          │
                    FastAPI Backend
                          │
                    SQLAlchemy ORM
                          │
                     SQLite Database
```

---

# Technology Stack

## Frontend

* Next.js
* React 19
* Tailwind CSS v4
* Lucide React
* TypeScript

## Backend

* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn

## Database

* SQLite

---

# Database Design

## meetings

| Field       | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| id          | Integer  | Primary Key                  |
| meeting_id  | String   | Unique Zoom-style Meeting ID |
| title       | String   | Meeting title                |
| description | Text     | Meeting description          |
| start_time  | DateTime | Scheduled meeting time       |
| duration    | Integer  | Duration in minutes          |
| type        | String   | Instant or Scheduled         |
| host_name   | String   | Meeting host                 |
| is_active   | Boolean  | Active status                |

---

# Project Structure

```
zoom-clone/

│
├── backend/
│   ├── app/
│   ├── database/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── seed/
│   └── main.py
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── styles/
│   ├── public/
│   └── package.json
│
├── screenshots/
│
└── README.md
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

python -m app.seed.seed_data

uvicorn app.main:app --reload
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Application

```
http://localhost:3000
```

---

# API Overview

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | /meetings      | Fetch all meetings |
| POST   | /meetings      | Create meeting     |
| GET    | /meetings/{id} | Fetch meeting      |
| PUT    | /meetings/{id} | Update meeting     |
| DELETE | /meetings/{id} | Delete meeting     |

---

# Security

Browser media devices require secure contexts.

For camera and microphone functionality, run the frontend using:

```
http://localhost:3000
```

instead of local network IP addresses.

---

# Future Enhancements

* WebRTC peer-to-peer video streaming
* Authentication and authorization
* Screen sharing
* Meeting recording
* Waiting rooms
* Host controls
* File sharing
* Live captions
* Notifications
* Email invitations
* Calendar integration
* PostgreSQL support
* Docker deployment
* CI/CD pipeline

---

# Author

Developed as a full-stack engineering project demonstrating modern frontend, backend, and database development practices using Next.js and FastAPI.
