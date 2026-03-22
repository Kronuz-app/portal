# Tech Stack

## Core Technologies

- **Runtime**: Node.js with npm package manager
- **Build Tool**: Vite 5.4
- **Framework**: React 18.3 with TypeScript 5.8
- **Styling**: Tailwind CSS 3.4 (custom configuration, no shadcn/ui)
- **Routing**: React Router DOM v6.30
- **State Management**: 
  - Zustand v5.0 for global state (auth, booking)
  - TanStack React Query v5.83 for server state and caching
- **Forms**: React Hook Form v7.61 with Zod v3.25 validation
- **Testing**: Vitest v3.2 with React Testing Library v16
- **Property-Based Testing**: fast-check v4.6 for correctness properties

## UI Approach

Unlike the admin panel, this project uses custom UI components built directly with Tailwind CSS rather than shadcn/ui. Components are located in `src/components/`.

Key UI libraries:
- Lucide React v0.462 for icons
- Custom components for booking flow
- Mobile-first responsive design
- Skin system for customizable themes

## Development Server

- Dev server runs on `http://localhost:5173` (Vite default)
- Uses Vite's HMR (Hot Module Replacement)
- Standard React plugin (@vitejs/plugin-react, not SWC)
- Server configured on port 5173

## Common Commands

```bash
# Development
npm run dev              # Start dev server on port 5173

# Building
npm run build            # TypeScript check (tsc -b) + production build (vite build)
npm run preview          # Preview production build locally

# Testing
npm run test             # Run tests once (vitest run)
npm run test:watch       # Run tests in watch mode (vitest)
npm run coverage         # Run tests with coverage report (vitest run --coverage)
```

## Environment Variables

Environment variables are configured via `.env` files and accessed using `import.meta.env.VITE_*` pattern.

Required variables:
- `VITE_API_URL`: Backend API URL (defaults to `http://localhost:3000` if not set)

Example usage:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## TypeScript Configuration

- Relaxed TypeScript settings for rapid development
- `noImplicitAny: false`
- `strictNullChecks: false`
- `noUnusedLocals: false`
- `target: ES2020`
- `module: ESNext`
- Path alias `@/*` maps to `./src/*`
- Build mode: `tsc -b` (project references)

## Shop/Unit Reference System

The application uses a URL-based reference system:
- `?ref=` parameter contains base64-encoded `shopId:unitId`
- Alternatively, uses slug-based routing: `/:slug` (e.g., `/barbearia-centro`)
- Decoded values are stored in localStorage
- `X-Shop-Id` header is automatically added to all API requests
- Slug resolution service maps slugs to shopId/unitId

## Skin System

The application supports customizable themes (skins):
- Skin configurations in `src/config/skins/`
- SkinContext provides theme to all components
- Customizable colors, fonts, and branding
- Loaded based on shop/unit configuration

## API Integration

- Axios-based API client in `lib/api.ts`
- Automatic `X-Shop-Id` header injection
- Error handling with custom `ApiError` class
- Request/response interceptors
- Base URL from environment variable
