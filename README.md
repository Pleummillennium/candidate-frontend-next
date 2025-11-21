# Task Management System - Frontend

Frontend application for the Task Management System built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Architecture:** Clean Architecture pattern
- **Authentication:** JWT-based authentication

## Features

- JWT-based authentication (login/register)
- Task management (CRUD operations)
- Task status tracking (To Do, In Progress, Done)
- Archive/Unarchive tasks
- Real-time commenting on tasks
- Change logs tracking
- Clean Architecture folder structure
- Type-safe API integration with Go backend

## Prerequisites

- Node.js 18+ or later
- npm or yarn or pnpm
- Backend API running on `http://localhost:8080`

## Backend Repository

This frontend connects to: [candidate-backend-api](https://github.com/Pleummillennium/candidate-backend-api)

The backend is a Go-based Task Management API with:
- PostgreSQL database
- JWT authentication
- Clean Architecture
- RESTful endpoints

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

5. Make sure the backend API is running on port 8080

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Project Structure

```
candidate-frontend-next/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── features/    # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts   # Authentication hook
│   │   ├── useTasks.ts  # Tasks list hook
│   │   ├── useTask.ts   # Single task hook
│   │   └── useComments.ts # Comments hook
│   ├── lib/             # Core utilities and configurations
│   │   └── api-client.ts # API client with JWT support
│   ├── services/        # API service layer
│   │   ├── auth.service.ts    # Authentication service
│   │   ├── task.service.ts    # Task service
│   │   └── comment.service.ts # Comment service
│   ├── types/           # TypeScript type definitions
│   │   ├── task.ts      # Task types
│   │   ├── comment.ts   # Comment types
│   │   ├── user.ts      # User/Auth types
│   │   └── api.ts       # API response types
│   ├── utils/           # Helper functions
│   └── constants/       # Application constants
├── public/              # Static assets
└── ...config files
```

## API Integration

The frontend connects to the Go backend API:

### Authentication (Public)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Tasks (Protected - requires JWT)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/archived` - Get archived tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/archive` - Archive task
- `POST /api/tasks/:id/unarchive` - Unarchive task
- `GET /api/tasks/:id/logs` - Get task change logs

### Comments (Protected - requires JWT)
- `GET /api/tasks/:id/comments` - Get comments for task
- `POST /api/tasks/:id/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_API_VERSION` | API version | `v1` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Task Management System` |

## Authentication Flow

1. User registers via `/auth/register`
2. User logs in via `/auth/login` and receives JWT token
3. Token is stored in localStorage
4. All subsequent API calls include the token in Authorization header
5. Token is automatically cleared on 401 responses

## Development

### Custom Hooks Usage

```typescript
// Authentication
import { useAuth } from '@/hooks';

const { user, isAuthenticated, login, logout } = useAuth();

// Tasks
import { useTasks } from '@/hooks';

const { tasks, loading, error, refetch } = useTasks();

// Single Task
import { useTask } from '@/hooks';

const { task, loading, error } = useTask(taskId);

// Comments
import { useComments } from '@/hooks';

const { comments, loading, error } = useComments(taskId);
```

### Service Layer Usage

```typescript
import { taskService, authService, commentService } from '@/services';

// Login
await authService.login({ email, password });

// Create task
await taskService.create({ title, description, status });

// Add comment
await commentService.create(taskId, { content });
```

## License

ISC
