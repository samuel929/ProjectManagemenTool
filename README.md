🚀 Project Management App - Full Stack (Monorepo)

This project is a Project and Task Management System with real-time updates and notifications. It includes a Node.js/Express backend and a Next.js frontend, using Redis for pub/sub notifications and project completion tracking.

🗂️ Monorepo Structure

```
my-repo/
├── backend/           # Express API
├── frontend/          # Next.js App
├── .github/workflows/ # GitHub Actions CI pipeline
└── README.md
```

🔧 Backend Documentation (/backend)

📌 Features

CRUD for Projects (title, description, deadline)

CRUD for Tasks within Projects (title, description, status, assignee)

Project completion tracking with Redis

Real-time notifications using Redis Pub/Sub

⚙️ Technologies Used

Node.js

Express

MongoDB (with Mongoose)

Redis (Pub/Sub + caching)

Jest (Unit Testing)

▶️ How to Run the Backend

```
cd backend
npm install
npm run dev
```

🧪 Run Tests

```
npm test
```

📂 API Routes

Projects

```
GET    /projects
POST   /projects
PUT    /projects/:id
DELETE /projects/:id
```

Tasks

```
GET    /projects/:projectId/tasks
POST   /projects/:projectId/tasks
PUT    /projects/:projectId/tasks/:taskId
DELETE /projects/:projectId/tasks/:taskId
```

🔔 Notifications (Redis Pub/Sub)

Triggered when tasks are assigned or status changes.

Subscribed by the notification service to alert users.

✅ Project Completion Tracking

Redis stores project deadline & completed tasks.

Automatically marks a project as complete if all tasks are done before the deadline.

🌐 Frontend Documentation (/frontend)

📌 Features

User-friendly dashboard for Projects & Tasks

Task assignment and status updates

Visual project progress tracking

Real-time notifications via API

⚙️ Technologies Used

Next.js

React

Tailwind CSS

Axios (API calls)

Jest or React Testing Library (testing)

▶️ How to Run the Frontend

```
cd frontend
npm install --legacy-peer-deps
npm run dev
```

🧪 Run Tests

```
npm test
```

🔁 GitHub Actions Pipeline

📁 Workflow File: .github/workflows/ci.yml

🧪 Pipeline Stages

Checkout Code

Install Dependencies

Run Tests (Backend & Frontend)

Build Projects

Redis Service for backend tests

🖥️ Pipeline Config Overview

```
jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      redis:
        image: redis:latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm test && echo "Build JS Backend"

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm test && npm run build
```

🙌 Author & Contributions

Created by Samuel Madigage
