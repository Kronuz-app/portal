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
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── booking/           # Booking wizard components
│   │   ├── BookingWizard.tsx
│   │   ├── ServiceSelector.tsx
│   │   ├── AddonSelector.tsx
│   │   ├── ProfessionalSelector.tsx
│   │   ├── DateTimeSelector.tsx
│   │   ├── BookingSummary.tsx
│   │   └── ...
│   ├── layout/            # Layout components
│   │   ├── MobileLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── SkinLoadingScreen.tsx  # Loading screen with skin
│   └── SlugNotFoundError.tsx  # Error for invalid slugs
├── pages/                 # Route pages/views
│   ├── HomePage.tsx              # Landing page
│   ├── BookingPage.tsx           # Main booking wizard
│   ├── BookingSuccessPage.tsx    # Confirmation screen
│   ├── AppointmentsPage.tsx      # List of user appointments
│   ├── AppointmentDetailPage.tsx # Single appointment view
│   ├── LoginPage.tsx             # Phone authentication
│   └── NotFoundPage.tsx          # 404 page
├── hooks/                 # Custom React hooks (TanStack Query)
│   ├── useServices.ts            # Service listing query
│   ├── useAddons.ts              # Addon services query
│   ├── useProfessionals.ts       # Professional listing query
│   ├── useAvailableSlots.ts      # Available time slots query
│   ├── useAppointments.ts        # User appointments query
│   ├── useCreateAppointment.ts   # Create appointment mutation
│   ├── useCancelAppointment.ts   # Cancel appointment mutation
│   ├── useShop.ts                # Shop information query
│   ├── useTexts.ts               # UI text configuration
│   └── useMetaTags.ts            # Dynamic meta tags
├── services/              # API service layer
│   ├── serviceService.ts         # Service API calls
│   ├── addonService.ts           # Addon API calls
│   ├── professionalService.ts    # Professional API calls
│   ├── availabilityService.ts    # Availability API calls
│   ├── appointmentService.ts     # Appointment API calls
│   ├── authService.ts            # Authentication API calls
│   ├── shopService.ts            # Shop information API calls
│   ├── slugResolver.ts           # Slug to shopId/unitId resolution
│   └── slugResolver.test.ts      # Slug resolver tests
├── stores/                # Zustand state stores
│   ├── authStore.ts       # Authentication state (phone, token, clientId)
│   └── bookingStore.ts    # Booking wizard state (service, addons, professional, date, time)
├── schemas/               # Zod validation schemas
│   └── phoneSchema.ts     # Phone number validation
├── contexts/              # React contexts
│   └── SkinContext.tsx    # Theme/skin context provider
├── lib/                   # Utility libraries
│   ├── api.ts            # Axios client with shop/unit headers
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # General utilities
│   ├── price.ts          # Price formatting utilities
│   ├── encoding.ts       # Base64 encoding/decoding
│   └── __tests__/        # Library tests
├── config/                # Configuration files
│   ├── texts.json        # UI text strings (i18n-ready)
│   ├── niche.json        # Niche-specific configuration
│   └── skins/            # Skin/theme configurations
├── mocks/                 # Mock data for development
│   ├── services.ts
│   ├── addons.ts
│   ├── professionals.ts
│   ├── availability.ts
│   └── appointments.ts
├── test/                  # Test files
│   ├── unit/             # Unit tests
│   ├── properties/       # Property-based tests
│   └── setup.ts          # Test environment setup (jsdom, testing-library)
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

- **UI Components** (`components/ui/`): Base reusable components (Button, Input, Card, Modal, etc.)
  - Built with Tailwind CSS (no shadcn/ui)
  - Mobile-first responsive design
  - Accessible and semantic HTML
- **Booking Components** (`components/booking/`): Booking wizard flow
  - `BookingWizard.tsx`: Main wizard container
  - `ServiceSelector.tsx`: Service selection step
  - `AddonSelector.tsx`: Optional addon selection
  - `ProfessionalSelector.tsx`: Professional selection (or "no preference")
  - `DateTimeSelector.tsx`: Date and time slot selection
  - `BookingSummary.tsx`: Final confirmation summary
- **Layout Components** (`components/layout/`): Page layouts
  - `MobileLayout.tsx`: Main mobile-first layout
  - `Header.tsx`: App header with navigation
  - `Footer.tsx`: App footer
- **Utility Components**:
  - `SkinLoadingScreen.tsx`: Loading screen with theme
  - `SlugNotFoundError.tsx`: Error display for invalid slugs
- **Pages** (`pages/`): Route-level components
  - `HomePage.tsx`: Landing/welcome page
  - `BookingPage.tsx`: Main booking wizard
  - `BookingSuccessPage.tsx`: Confirmation after booking
  - `AppointmentsPage.tsx`: List of user appointments (upcoming and past)
  - `AppointmentDetailPage.tsx`: Single appointment details
  - `LoginPage.tsx`: Phone-based authentication
  - `NotFoundPage.tsx`: 404 error page

### Service Layer

Services in `src/services/` handle API communication:
- Named as `{entity}Service.ts` (e.g., `appointmentService.ts`, `serviceService.ts`)
- Use the `clientApi` helper from `lib/api.ts` for requests
- Automatically include `X-Shop-Id` header from localStorage
- Return typed data or throw `ApiError`
- Services:
  - `serviceService.ts`: Fetch available services
  - `addonService.ts`: Fetch addon services
  - `professionalService.ts`: Fetch professionals
  - `availabilityService.ts`: Fetch available time slots
  - `appointmentService.ts`: Create, list, cancel appointments
  - `authService.ts`: Phone-based authentication
  - `shopService.ts`: Fetch shop information
  - `slugResolver.ts`: Resolve slug to shopId/unitId

### State Management

- **Global State**: Zustand stores in `src/stores/`
  - `authStore.ts`: Authentication state
    - `phone`: User's phone number
    - `token`: JWT token for authenticated requests
    - `clientId`: Client ID from backend
    - `isAuthenticated`: Authentication status
    - Actions: `login()`, `logout()`, `setToken()`
  - `bookingStore.ts`: Booking wizard state
    - `selectedService`: Chosen service
    - `selectedAddons`: Array of selected addon services
    - `selectedProfessional`: Chosen professional (or null for "no preference")
    - `selectedDate`: Selected date
    - `selectedTime`: Selected time slot
    - `currentStep`: Current wizard step (1-5)
    - Actions: `setService()`, `addAddon()`, `removeAddon()`, `setProfessional()`, `setDateTime()`, `nextStep()`, `previousStep()`, `reset()`
- **Server State**: TanStack Query hooks in `src/hooks/`
  - `useServices`: Query for available services
  - `useAddons`: Query for addon services
  - `useProfessionals`: Query for available professionals
  - `useAvailableSlots`: Query for available time slots (depends on service, professional, date)
  - `useAppointments`: Query for user's appointments (upcoming and past)
  - `useCreateAppointment`: Mutation for creating new appointment
  - `useCancelAppointment`: Mutation for cancelling appointment
  - `useShop`: Query for shop information
  - All hooks use React Query for caching, optimistic updates, and automatic refetching

### Configuration

- **Text Strings** (`config/texts.json`): All UI text for easy localization
  - Button labels
  - Page titles
  - Form labels
  - Error messages
  - Success messages
  - Wizard step titles
- **Niche Config** (`config/niche.json`): Business-specific settings
  - Industry-specific terminology
  - Default service categories
  - Booking flow customizations
- **Skin Configurations** (`config/skins/`): Theme customizations
  - Color schemes
  - Font families
  - Logo and branding
  - Custom CSS variables

### Testing

- **Unit Tests**: In `src/test/unit/` or co-located with source files
- **Property-Based Tests**: In `src/test/properties/` using fast-check
  - Test invariants and edge cases
  - Ensure correctness of business logic
- **Test Setup**: `src/test/setup.ts` configures jsdom and testing-library
- **Test Framework**: Vitest v3.2 with React Testing Library v16
- **Coverage**: Run with `npm run coverage` (vitest with v8 coverage provider)
- **Test Files**: Co-located tests like `slugResolver.test.ts`

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

1. User accesses URL with `?ref=base64(shopId:unitId)` or slug route `/:slug`
2. For ref parameter: `decodeRef()` in `lib/api.ts` extracts and stores in localStorage
3. For slug route: `slugResolver.ts` resolves slug to shopId/unitId via API call
4. All API requests include `X-Shop-Id` header automatically via axios interceptor
5. Unit ID is used for filtering availability and services
6. Shop/unit information persists in localStorage for subsequent visits

### Routing

Routes defined in `App.tsx`:
- `/` - HomePage (landing page)
- `/:slug` - BookingPage (booking wizard with slug resolution)
- `/booking` - BookingPage (booking wizard with ref parameter)
- `/booking/success` - BookingSuccessPage (confirmation)
- `/appointments` - AppointmentsPage (user's appointments list)
- `/appointments/:id` - AppointmentDetailPage (single appointment)
- `/login` - LoginPage (phone authentication)
- `*` - NotFoundPage (404)
