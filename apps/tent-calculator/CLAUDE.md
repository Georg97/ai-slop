# Tent Calculator - Triangular Prism Tent Sizing Tool

## App Overview

**Purpose:** Calculate dimensions for a triangular prism mosquito net tent that fits under a tarp
**Status:** Development (Development/Testing/Production)
**Port:** 3000 (development)
**Deployment:** TBD

## Technical Stack

- **Language:** TypeScript (strict mode) - NO JavaScript files allowed
- **Framework:** T3 Stack (Next.js 14, TypeScript, Tailwind CSS, tRPC, Prisma)
- **State Management:** Zustand (for client-side state)
- **Data Fetching:** TanStack Query (React Query) for client-side queries
- **UI Components:** shadcn/ui (with Tailwind CSS)
- **Tables:** TanStack Table (for data tables)
- **Form Validation:** Zod (for schema validation) + React Hook Form
- **Database:** SQLite (SQLite/PostgreSQL)
- **Authentication:** None (NextAuth.js/Custom/None)
- **External APIs:** None
- **Special Dependencies:** Mathematical calculation engine for tent geometry

## TypeScript Requirements

**CRITICAL:** This entire app must be TypeScript only:
- All `.js` files must be `.ts` or `.tsx`
- Use strict TypeScript configuration
- All functions must have proper type annotations
- No `any` types unless absolutely necessary
- All props, state, and API responses must be properly typed
- Configuration files should be TypeScript where possible

## Required Tech Stack Usage

**MANDATORY:** Use only these technologies:
- **State Management:** Zustand stores only (no Redux, Context, etc.)
- **Data Fetching:** TanStack Query only (no SWR, native fetch, etc.)
- **UI Components:** shadcn/ui only (no other component libraries)
- **Tables:** TanStack Table only (no other table libraries)
- **Form Validation:** Zod + React Hook Form only (no Formik, Yup, etc.)
- **API Layer:** tRPC only (no REST endpoints unless absolutely necessary)
- **Styling:** Tailwind CSS only (no styled-components, emotion, etc.)

## Database Schema

Tent calculations and padding profiles for a triangular prism tent geometry system

```prisma
model TentCalculation {
  id                String   @id @default(cuid())
  name              String
  
  // Target parameters
  targetFloorWidth  Float?
  targetFootHeight  Float?
  targetHeadHeight  Float?
  
  // Padding parameters
  verticalPadding   Float   // top clearance from inner peak to tarp
  horizontalPadding Float   // side clearance from inner edges to tarp
  endPadding        Float   // foot/head clearance
  
  // Calculated results
  actualFootHeight  Float?
  actualHeadHeight  Float?
  actualFloorWidth  Float?
  
  // Metadata
  calculationMode   String  // "solve_height", "solve_width", "solve_padding"
  isValid           Boolean @default(true)
  warnings          Json?   // geometric constraint warnings
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model PaddingProfile {
  id                String   @id @default(cuid())
  name              String
  description       String
  verticalPadding   Float
  horizontalPadding Float
  endPadding        Float
  isDefault         Boolean  @default(false)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## Mathematical Model

### Tent Geometry Constraints
- **Tarp dimensions:** 1.5m × 2.15m with diagonal sides ~2.175m
- **Inner tent length:** 2m (for clearance)
- **Cross-sections:** Isosceles triangles at foot (0.75m base) and head (1.075m base)
- **Shape:** Truncated triangular prism (trapezoid when viewed from side)

### Key Formulas
```typescript
// Available space after padding
availableHeight(position: number) = tarpHeight(position) - verticalPadding
availableWidth(position: number) = tarpWidth(position) - (2 * horizontalPadding)

// Maximum inner tent height for given floor width
maxInnerHeight = availableHeight - sqrt((floorWidth/2)² + requiredSlope²)

// Floor width for given height with padding
maxFloorWidth = 2 * sqrt((availableHeight - verticalPadding)² - requiredSlope²)

// Height interpolation along tent length
heightAtPosition(x: number) = footHeight + (headHeight - footHeight) * (x / tentLength)

// Constraint validation
isValid = (innerHeight + verticalPadding <= tarpHeight) && 
          (innerWidth + 2*horizontalPadding <= tarpWidth)
```

## API Endpoints (tRPC)

### Queries
- `getTentCalculations` - Get all saved calculations
- `getTentCalculation` - Get specific calculation by ID
- `getPaddingProfiles` - Get all padding profiles
- `calculateTentDimensions` - Calculate missing dimensions given inputs

### Mutations  
- `createTentCalculation` - Save new calculation
- `updateTentCalculation` - Update existing calculation
- `deleteTentCalculation` - Delete calculation
- `createPaddingProfile` - Create new padding profile
- `updatePaddingProfile` - Update padding profile
- `deletePaddingProfile` - Delete padding profile

## UI Components

### Pages
- `/` - Main calculator interface
- `/calculations` - Saved calculations history
- `/profiles` - Padding profile management

### Components
- `TentCalculator` - Main calculation form with live updates
- `DimensionInputs` - Input fields for target dimensions
- `PaddingControls` - Sliders for padding adjustments
- `ResultsDisplay` - Calculated dimensions and warnings
- `TentVisualization` - SVG diagrams showing tent cross-sections
- `CalculationHistory` - List of saved calculations
- `PaddingProfileManager` - Create/edit padding profiles
- `GeometryValidator` - Real-time constraint validation

## Development Setup

### Prerequisites
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# No authentication needed for this app
```

### Database Setup
```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database (if applicable)
pnpm prisma db seed
```

### Development Commands
```bash
# Start development server
pnpm dev

# Build for production (ALWAYS run before deploying)
pnpm build

# Type checking only
pnpm typecheck

# Start production server
pnpm start

# Database operations
pnpm prisma generate
pnpm prisma studio
pnpm prisma migrate dev
```

## Features

### Core Features
- Interactive tent dimension calculator with real-time updates
- Padding parameter controls (vertical, horizontal, end clearances)
- Multiple calculation modes (solve for height, width, or padding)
- Geometric constraint validation with warnings
- SVG visualization of tent cross-sections
- Save/load calculation configurations
- Padding profile management

### Planned Features
- 3D tent visualization
- Export tent cutting patterns
- Material estimation calculator
- Multiple tent configurations support

## Development Notes

### Current Implementation Status
- ✅ T3 stack setup complete
- ✅ Database schema designed
- ⏳ Mathematical calculation engine
- ⏳ Calculator form implementation
- ⏳ SVG visualization components
- ⏳ Padding profile system

### Known Issues
- ✅ RESOLVED: TypeScript compilation errors with type vs value imports
- ✅ RESOLVED: Vercel deployment failures due to missing DATABASE_URL

### Technical Decisions
- Using SQLite for simplicity (single-user app)
- Real-time calculation updates with Zustand state management
- SVG-based visualizations for precise geometric representation
- Form validation with Zod schemas for type safety

### Performance Considerations
- Debounced input updates to prevent excessive calculations
- Memoized calculation results for common inputs
- Efficient SVG rendering for visualizations

## Testing Strategy

### Unit Tests
- Mathematical calculation functions
- Geometric constraint validation
- Form validation logic

### Integration Tests
- Calculator form with live updates
- Database CRUD operations
- Padding profile management

### Manual Testing Checklist
- Enter various tent dimensions and verify calculations
- Test padding adjustments and constraint validation
- Verify saved calculations persistence
- Test edge cases and geometric limits

## Deployment

### Build Process
```bash
pnpm build
```

### Environment Variables (Production)
```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_URL="https://your-domain.com"
```

### Deployment Notes
- Deploy via Vercel with SQLite database
- No authentication required for single-user app

## Maintenance

### Dependencies to Monitor
- Prisma (database operations)
- shadcn/ui components
- Zustand (state management)
- TanStack Query (data fetching)

### Regular Tasks
- Update dependencies monthly
- Backup calculation database
- Monitor calculation accuracy

### Backup Strategy
- Export calculation data as JSON
- Version control for app configuration

## Common Build Issues and Solutions

### TypeScript Import Errors
**Issue:** `'X' cannot be used as a value because it was imported using 'import type'`
**Solution:** Separate type imports from value imports:
```typescript
// ❌ Wrong - imports constants as types
import type { DEFAULT_VALUE, MyType } from './types';

// ✅ Correct - separate imports
import type { MyType } from './types';
import { DEFAULT_VALUE } from './types';
```

### Vercel Deployment Environment Variables
**Issue:** `Invalid environment variables: DATABASE_URL Required`
**Solution:** Set default values in `src/env.js`:
```typescript
// ❌ Wrong - required without default
DATABASE_URL: z.string(),

// ✅ Correct - with default fallback
DATABASE_URL: z.string().default("file:./db.sqlite"),

// Also update runtime env
runtimeEnv: {
  DATABASE_URL: process.env.DATABASE_URL || "file:./db.sqlite",
}
```

### Escaped Quote Syntax in Components
**Issue:** `className=\"...\"` causing JSX parsing errors
**Solution:** Use proper quote syntax:
```tsx
// ❌ Wrong - escaped quotes
<div className=\"bg-white p-4\" />

// ✅ Correct - normal quotes
<div className="bg-white p-4" />
```

### Missing Prisma Client
**Issue:** `PrismaClient is not available`
**Solution:** Generate Prisma client:
```bash
pnpm prisma generate
```

### Authentication Dependencies (When Not Needed)
**Issue:** NextAuth errors when authentication not required
**Solution:** Remove unused auth dependencies and configuration files

## AI Agent Instructions

### When working on this app:
1. **TypeScript First:** Everything must be TypeScript - no JavaScript files
2. **Always read this file first** to understand the current state
3. **Use ONLY the approved tech stack:**
   - **State:** Zustand stores only
   - **Queries:** TanStack Query only
   - **UI:** shadcn/ui components only
   - **Tables:** TanStack Table only
   - **Forms:** Zod + React Hook Form only
   - **API:** tRPC only
4. **Update this file** when adding new features or dependencies
5. **Follow T3 stack patterns** - use tRPC for API, Prisma for database
6. **Keep the app focused** - stick to the core purpose
7. **Test changes locally** before deploying
8. **Strict typing:** Use proper TypeScript types, avoid `any`
9. **ALWAYS check for build errors** after making changes with `pnpm build`
10. **Fix import/export issues immediately** - separate type vs value imports correctly

### Common Tasks:
- **Adding a new page:** Create in `src/pages/`, add to navigation
- **Adding API endpoint:** Create in `src/server/api/routers/` (tRPC only)
- **Adding database model:** Update `prisma/schema.prisma`, run migration
- **Adding UI component:** Create in `src/components/` using shadcn/ui
- **Adding state management:** Create Zustand store in `src/stores/`
- **Adding data fetching:** Use TanStack Query hooks in `src/hooks/`
- **Adding forms:** Use Zod schema + React Hook Form
- **Adding tables:** Use TanStack Table components

### Code Style:
- **TypeScript Only:** Never create JavaScript files - everything must be TypeScript
- **Approved Tech Stack Only:** Use only Zustand, TanStack Query, shadcn/ui, TanStack Table, Zod
- Use strict TypeScript configuration with proper type annotations
- Follow existing naming conventions
- Keep components small and focused
- Use Tailwind CSS for styling (no other CSS solutions)
- Prefer composition over inheritance
- Type all props, state, functions, and API responses
- Avoid `any` types - use proper TypeScript types
- Use TypeScript for all configuration files where possible
- Follow shadcn/ui patterns for component structure
- Use Zustand for all client-side state management
- Use TanStack Query for all data fetching operations

### Critical Development Workflow:
1. **ALWAYS run `pnpm build` after making changes**
2. **Fix TypeScript errors immediately** - don't ignore them
3. **Separate type imports from value imports** correctly
4. **Test locally before committing**
5. **Environment variables must have defaults for Vercel deployment**
6. **No JavaScript files** - convert everything to TypeScript