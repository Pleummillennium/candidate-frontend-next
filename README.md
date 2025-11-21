# Candidate Management System - Frontend

Frontend application for the Candidate Management System built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Architecture:** Clean Architecture pattern

## Features

- Modern React with Server Components
- Type-safe API integration with Go backend
- Clean Architecture folder structure
- Reusable hooks and utilities
- Environment-based configuration

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

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   ├── lib/             # Core utilities and configurations
│   ├── services/        # API service layer
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions
│   └── constants/       # Application constants
├── public/              # Static assets
└── ...config files
```

## API Integration

The frontend connects to the Go backend API with the following services:

- **Candidate Service:** CRUD operations for candidates
- **API Client:** Generic HTTP client with error handling
- **Custom Hooks:** React hooks for data fetching

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_API_VERSION` | API version | `v1` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Candidate Management System` |

## Backend Repository

This frontend connects to: [candidate-backend-api](https://github.com/Pleummillennium/candidate-backend-api)

## License

ISC
