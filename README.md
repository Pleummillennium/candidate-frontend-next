# Candidate Management System - Frontend

Frontend application for tracking and managing interview candidates built with Next.js, TypeScript, and Tailwind CSS.

## Overview

A modern web application to help HR teams and hiring managers track candidates through the interview process. Manage candidate information, interview schedules, status tracking, and interview notes all in one place.

## Features

- **Candidate Tracking** - Add and manage candidate information
- **Status Management** - Track candidates through stages (To Do, In Progress, Done)
- **Interview Notes** - Add comments and feedback for each candidate
- **Authentication** - Secure JWT-based login and registration
- **Archive System** - Archive completed candidates
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Go + Gin + PostgreSQL
- **Architecture:** Clean Architecture pattern
- **Authentication:** JWT-based

## Prerequisites

- Node.js 18+ or later
- npm or yarn or pnpm
- Backend API running on `http://localhost:8080`

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Pleummillennium/candidate-frontend-next.git
cd candidate-frontend-next
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

5. Make sure the backend API is running

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── candidates/
│   │   ├── page.tsx                # Candidates list
│   │   ├── new/page.tsx            # Add new candidate
│   │   └── [id]/page.tsx           # Candidate detail
│   └── auth/
│       ├── login/page.tsx          # Login page
│       └── register/page.tsx       # Registration page
├── hooks/
│   ├── useAuth.ts                  # Authentication hook
│   ├── useTasks.ts                 # Candidates list hook
│   ├── useTask.ts                  # Single candidate hook
│   └── useComments.ts              # Comments hook
├── services/
│   ├── auth.service.ts             # Auth API calls
│   ├── task.service.ts             # Candidate API calls
│   └── comment.service.ts          # Comment API calls
├── types/
│   ├── task.ts                     # Candidate type definitions
│   ├── comment.ts                  # Comment types
│   ├── user.ts                     # User/Auth types
│   └── api.ts                      # API response types
└── lib/
    └── api-client.ts               # HTTP client with JWT

```

## Pages

### Home (/)
- Landing page with feature overview
- Links to candidates and login

### Candidates List (/candidates)
- View all candidates
- Filter by status (To Do, In Progress, Done)
- Quick actions (View, Archive, Delete)

### Add Candidate (/candidates/new)
- Form to add new candidate
- Fields: Name, Description, Status, Interview Date

### Candidate Detail (/candidates/[id])
- View candidate details
- Edit candidate information
- Add interview notes and comments
- Comment history

### Login (/auth/login)
- User authentication
- JWT token management

### Register (/auth/register)
- New user registration
- Account creation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_API_VERSION` | API version | `v1` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Candidate Management System` |

## Backend Repository

This frontend connects to: [candidate-backend-api](https://github.com/Pleummillennium/candidate-backend-api)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

Or use Vercel CLI:
```bash
npm install -g vercel
vercel
```

## API Integration

The system uses the Task Management API as the backend:
- **Tasks** → **Candidates**
- **Comments** → **Interview Notes**
- **Status** → **Interview Stages**

API Endpoints:
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET /api/tasks` - Get candidates
- `POST /api/tasks` - Create candidate
- `GET /api/tasks/:id` - Get candidate
- `PUT /api/tasks/:id` - Update candidate
- `DELETE /api/tasks/:id` - Delete candidate
- `POST /api/tasks/:id/archive` - Archive candidate
- `GET /api/tasks/:id/comments` - Get comments
- `POST /api/tasks/:id/comments` - Add comment

## License

ISC
