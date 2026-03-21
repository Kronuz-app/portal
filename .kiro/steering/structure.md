# Project Structure

## Root Directory

```
trinity-scheduler-client/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Build output
├── .kiro/                  # Kiro configuration and specs
└── node_modules/           # Dependencies
```

## Source Directory (`src/`)

```
src/
├── components/             # React components
│   ├── ui/                # Base UI components (custom, not shadcn)
│   ├── booking/           # Booking wizard components
│   └── layout/            # Layout components (MobileLayout, etc.)
├── pages/                 # Route pages/views
├── hooks/                 # Custom React hooks (TanStack Query)
├── services/              # API service layer
├── stores/                # Zustand state stores
├── schemas/               # Zod validation schemas
├── lib/                   # Utility libraries
│   ├── api.ts            # API client with shop/unit headers
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # General utilities
│   └── price.ts          # Price formatting utilities
├── config/                # Configuration files
│   ├── texts.json        # UI text strings (i18n-ready)
│   └── niche.json        # Niche-specific configuration
├── mocks/                 # Mock data for development
├── test/                  # Test files
│   ├── unit/             # Unit tests
│   ├── properties/       # Property-based tests
│   └── setup.ts          # Test environment setup
├── App.tsx               # Root component with routes
├── main.tsx              # Application entry point
└── index.css             # Global styles and Tailwind imports
```

## Key Conventions

### Path Aliases

Use the `@/` alias for imports from `src/`:
```typescript
import { MobileLayout } from "@/components/layout/MobileLayout"
import { clientApi } from "@/lib/api"
import { useServices } from "@/hooks/useServices"
```

### Component Organization

- **UI Components** (`components/ui/`): Base reusable components (Button, Input, Card, etc.)
- **Feature Components** (`components/booking/`, `components/layout/`): Domain-specific components
- **Pages** (`pages/`): Route-level components
  - `BookingPage.tsx`: Main booking wizard
  - `AppointmentsPage.tsx`: List of user appointments
  - `AppointmentDetailPage.tsx`: Single appointment view
  - `BookingSuccessPage.tsx`: Confirmation screen
  - `LoginPage.tsx`: Phone authentication
  - `NotFoundPage.tsx`: 404 page

### Service Layer

Services in `src/services/` handle API communication:
- Named as `{entity}Service.ts` (e.g., `appointmentService.ts`, `serviceService.ts`)
- Use the `clientApi` helper from `lib/api.ts` for requests
- Automatically include `X-Shop-Id` header from localStorage
- Return typed data or throw `ApiError`

### State Management

- **Global State**: Zustand stores in `src/stores/`
  - `authStore.ts`: Authentication state (phone, token)
  - `bookingStore.ts`: Booking wizard state (selected service, professional, date, etc.)
- **Server State**: TanStack Query hooks in `src/hooks/`
  - `useServices`, `useProfessionals`, `useAvailableSlots`, etc.

### Configuration

- **Text Strings** (`config/texts.json`): All UI text for easy localization
- **Niche Config** (`config/niche.json`): Business-specific settings

### Testing

- **Unit Tests**: In `src/test/unit/` or co-located with source
- **Property-Based Tests**: In `src/test/properties/` using fast-check
- **Test Setup**: `src/test/setup.ts` configures jsdom and testing-library

### Styling

- Use Tailwind utility classes
- Mobile-first responsive design
- CSS variables for theming (defined in `index.css`)
- Custom color palette matching brand

### Naming Conventions

- **Components**: PascalCase (e.g., `BookingWizard.tsx`, `ClientNameGate.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useServices.ts`, `useCreateAppointment.ts`)
- **Services**: camelCase with `Service` suffix (e.g., `appointmentService.ts`)
- **Stores**: camelCase with `Store` suffix (e.g., `bookingStore.ts`)
- **Schemas**: camelCase with `Schema` suffix (e.g., `phoneSchema.ts`)

### Shop/Unit Reference Flow

1. User accesses URL with `?ref=base64(shopId:unitId)`
2. `decodeRef()` in `lib/api.ts` extracts and stores in localStorage
3. All API requests include `X-Shop-Id` header automatically
4. Unit ID is used for filtering availability and services
