# Candidate Management System - Frontend

Frontend application for tracking and managing interview candidates built with Next.js, TypeScript, and Tailwind CSS.

## Overview

A modern web application to help HR teams and hiring managers track candidates through the interview process. Manage candidate information, interview schedules, status tracking, and interview notes all in one place.

## Features

- **Candidate Tracking** - Add and manage candidate information
- **Status Management** - Track candidates through stages (To Do, In Progress, Done)
- **Interview Notes** - Add comments and feedback for each candidate
- **Change History** - Track all changes made to candidates
- **Authentication** - Secure JWT-based login and registration
- **Archive System** - Archive completed candidates
- **Dark Theme** - Modern dark UI with Material Design
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI) v7 with Dark Theme
- **Styling:** Tailwind CSS v4 + Emotion
- **State Management:** React Hooks
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
├── app/                            # Next.js App Router
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout with theme
│   ├── candidates/
│   │   ├── page.tsx                # Candidates list
│   │   ├── new/page.tsx            # Add new candidate
│   │   └── [id]/page.tsx           # Candidate detail
│   └── auth/
│       ├── login/page.tsx          # Login page
│       └── register/page.tsx       # Registration page
├── components/                     # React components
│   ├── candidates/                 # Candidate-specific components
│   ├── features/                   # Feature components
│   ├── layout/                     # Layout components (Navbar, etc.)
│   └── ui/                         # Reusable UI components
├── hooks/                          # Custom React hooks
│   ├── useAuth.ts                  # Authentication hook
│   ├── useTasks.ts                 # Candidates list hook
│   ├── useTask.ts                  # Single candidate hook
│   └── useComments.ts              # Comments hook
├── services/                       # API service layer
│   ├── auth.service.ts             # Auth API calls
│   ├── task.service.ts             # Candidate API calls
│   └── comment.service.ts          # Comment API calls
├── types/                          # TypeScript type definitions
│   ├── task.ts                     # Candidate type definitions
│   ├── comment.ts                  # Comment types
│   ├── user.ts                     # User/Auth types
│   └── api.ts                      # API response types
├── lib/                            # Utility libraries
│   └── api-client.ts               # HTTP client with JWT
├── theme/                          # Material-UI theme configuration
│   └── theme.ts                    # Dark theme setup
├── constants/                      # App constants
└── utils/                          # Helper functions

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

1. **Push your code to GitHub**

2. **Import project in Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables:**
   - Go to Settings → Environment Variables
   - Add the following variables (use direct values, NOT secrets):

   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | Your production API URL | Production |
   | `NEXT_PUBLIC_API_URL` | Your preview API URL | Preview |
   | `NEXT_PUBLIC_API_URL` | Your dev API URL | Development |
   | `NEXT_PUBLIC_API_VERSION` | `v1` | All |
   | `NEXT_PUBLIC_APP_NAME` | `Candidate Management System` | All |

   **Important:**
   - Do NOT use "Secret" reference for `NEXT_PUBLIC_*` variables
   - These variables are exposed to the client-side, so they should be direct values
   - Make sure your API URL is accessible from the internet

4. **Deploy!**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deployment Checklist

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are configured correctly
- [ ] CORS is enabled on backend for your Vercel domain
- [ ] JWT secret matches between frontend and backend
- [ ] Database is properly configured and migrated

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

## Troubleshooting

### Common Issues

**1. "Environment Variable references Secret which does not exist" on Vercel**
- Solution: Don't use Secret references for `NEXT_PUBLIC_*` variables. Use direct values instead.
- Go to Settings → Environment Variables and enter values directly.

**2. API Connection Failed**
- Check if `NEXT_PUBLIC_API_URL` is correct
- Verify backend API is running and accessible
- Check CORS settings on backend
- Open browser console to see detailed error messages

**3. Authentication Issues**
- Clear browser localStorage and try logging in again
- Check if JWT token is valid (not expired)
- Verify backend auth endpoints are working

**4. Build Errors**
- Run `npm run type-check` to check TypeScript errors
- Run `npm run lint` to check linting issues
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

**5. Styling Issues**
- Clear browser cache
- Check if Tailwind CSS classes are properly configured
- Verify Material-UI theme is loaded correctly

### Getting Help

- Check [Issues](https://github.com/Pleummillennium/candidate-frontend-next/issues)
- Review backend API logs
- Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC
