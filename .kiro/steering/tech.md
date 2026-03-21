# Tech Stack

## Core Technologies

- **Runtime**: Node.js with npm package manager
- **Build Tool**: Vite 5
- **Framework**: React 18 with TypeScript 5
- **Styling**: Tailwind CSS 3 (custom configuration, no shadcn/ui)
- **Routing**: React Router DOM v6
- **State Management**: 
  - Zustand v5 for global state (auth, booking)
  - TanStack React Query v5 for server state
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **Property-Based Testing**: fast-check for correctness properties

## UI Approach

Unlike the admin panel, this project uses custom UI components built directly with Tailwind CSS rather than shadcn/ui. Components are located in `src/components/`.

Key UI libraries:
- Lucide React for icons
- Custom components for booking flow
- Mobile-first responsive design

## Development Server

- Dev server runs on `http://localhost:5173` (Vite default)
- Uses Vite's HMR (Hot Module Replacement)
- Standard React plugin (not SWC)

## Common Commands

```bash
# Development
npm run dev              # Start dev server on port 5173

# Building
npm run build            # TypeScript check + production build
npm run preview          # Preview production build

# Testing
npm run test             # Run tests once (Vitest)
npm run test:watch       # Run tests in watch mode
npm run coverage         # Run tests with coverage report
```

## Environment Variables

Environment variables are configured via `.env` files and accessed using `import.meta.env.VITE_*` pattern.

Required variables:
- `VITE_API_URL`: Backend API URL (defaults to `http://localhost:3000` if not set)

## TypeScript Configuration

- Relaxed TypeScript settings for rapid development
- `noImplicitAny: false`
- `strictNullChecks: false`
- `noUnusedLocals: false`
- Path alias `@/*` maps to `./src/*`

## Shop/Unit Reference System

The application uses a URL-based reference system:
- `?ref=` parameter contains base64-encoded `shopId:unitId`
- Decoded values are stored in localStorage
- `X-Shop-Id` header is automatically added to API requests
