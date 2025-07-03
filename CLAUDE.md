# AI-Slop Multi-App Repository

## Architecture Overview

This repository is a collection of mini utilities and applications, primarily built using AI agents. It follows a multi-app architecture where each app is self-contained but shares common infrastructure.

**Tech Stack:**
- **Language:** TypeScript (strict mode, everything must be TypeScript)
- **Package Manager:** pnpm (workspaces)
- **Framework:** T3 Stack (Next.js, TypeScript, Tailwind CSS, tRPC, Prisma, NextAuth.js)
- **State Management:** Zustand (for client-side state)
- **Data Fetching:** TanStack Query (React Query) for client-side queries
- **UI Components:** shadcn/ui (with Tailwind CSS)
- **Tables:** TanStack Table (for data tables)
- **Form Validation:** Zod (for schema validation)
- **Database:** Per-app basis (SQLite for simple apps, PostgreSQL for complex ones)
- **Deployment:** Vercel (recommended)

## Repository Structure

```
ai-slop/
├── CLAUDE.md                 # This file - main project documentation
├── README.md                 # Public repository description
├── package.json              # Root package.json with workspace config
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── apps/                     # Individual applications
│   ├── calculator/           # Example app
│   │   ├── CLAUDE.md        # App-specific development guide
│   │   ├── package.json     # App dependencies
│   │   └── src/             # T3 app structure
│   ├── image-utility/        # Another example app
│   └── erp-system-test/      # Yet another app
├── packages/                 # Shared packages
│   ├── ui/                  # Shared UI components (shadcn/ui)
│   ├── config/              # Shared configurations
│   └── shared/              # Common dependencies and utilities
└── scripts/                  # Automation scripts
    └── create-app.js         # New app creation script
```

## App Navigation System

Each app runs on its own port during development and has its own deployment. The main navigation is handled through:

1. **Development:** Each app runs independently (`pnpm dev --filter=calculator`)
2. **Production:** Each app deployed separately with cross-links in navigation
3. **Sidebar Navigation:** Implemented in shared UI package for consistency

## Creating a New App

### Automated Creation (Recommended)

```bash
pnpm create-app <app-name>
```

This script will:
1. Create new directory in `apps/<app-name>`
2. Initialize T3 stack with sensible defaults
3. Copy CLAUDE.md template and customize it
4. Add app to main navigation system
5. Prompt for app-specific requirements

### Manual Creation Process

1. **Create App Directory:**
   ```bash
   mkdir apps/<app-name>
   cd apps/<app-name>
   ```

2. **Initialize T3 Stack:**
   ```bash
   pnpm create t3-app@latest . --nextAuth --prisma --tailwind --trpc --typescript
   ```

3. **Copy CLAUDE.md Template:**
   ```bash
   cp ../../templates/CLAUDE.md.template ./CLAUDE.md
   ```

4. **Customize CLAUDE.md:**
   - Update app name and description
   - Define specific requirements and dependencies
   - Add app-specific development notes

5. **Add to Navigation:**
   - Update `packages/ui/src/navigation.tsx`
   - Add app metadata to `apps-config.json`

## Development Workflow

### Starting Development

```bash
# Install all dependencies
pnpm install

# Start specific app
pnpm dev --filter=<app-name>

# Start all apps (not recommended for many apps)
pnpm dev

# Start shared UI development
pnpm dev --filter=ui
```

### Adding Dependencies

```bash
# Add dependency to specific app
pnpm add <package> --filter=<app-name>

# Add shared dependency
pnpm add <package> -w

# Add dev dependency to specific app
pnpm add -D <package> --filter=<app-name>
```

### Building and Deployment

```bash
# Build specific app
pnpm build --filter=<app-name>

# Build all apps
pnpm build

# Deploy specific app (Vercel)
cd apps/<app-name>
vercel --prod
```

## App-Specific Configuration

Each app should have its own:
- **Database:** SQLite for simple apps, PostgreSQL for complex ones
- **Environment Variables:** `.env.local` in app directory
- **API Routes:** Self-contained within the app (tRPC routers)
- **Authentication:** Shared NextAuth.js configuration
- **State Management:** Zustand stores for app-specific state
- **Data Fetching:** TanStack Query for client-side data fetching
- **UI Components:** shadcn/ui components with app-specific customizations
- **Forms:** Zod schemas for validation with React Hook Form
- **Tables:** TanStack Table for data display
- **Styling:** Tailwind CSS with app-specific customizations

## Shared Resources

### UI Components (`packages/ui`)
- shadcn/ui components configured for the monorepo
- Common components used across apps
- Navigation sidebar
- Common layouts and utilities
- Shared Tailwind CSS configuration

### Configuration (`packages/config`)
- Shared TypeScript configurations
- ESLint and Prettier configs
- Common environment variable schemas
- Shared Next.js configurations

### Shared Dependencies (`packages/shared`)
- Zustand store utilities and types
- TanStack Query configurations
- Zod schemas for common data structures
- Shared utility functions and hooks
- Common types and interfaces

## Development Guidelines

### For Each App's CLAUDE.md

1. **App Overview:** What does this app do?
2. **Technical Requirements:** Specific libraries, APIs, external services
3. **Database Schema:** If applicable
4. **API Endpoints:** List of tRPC procedures
5. **UI Components:** App-specific components
6. **Development Notes:** Special considerations, known issues
7. **Testing Strategy:** How to test this app
8. **Deployment Notes:** App-specific deployment considerations

### Code Organization

- **TypeScript First:** Everything must be TypeScript - no JavaScript files
- Keep apps completely independent
- Use shared packages for truly common code
- Prefer copying over premature abstraction
- Each app should be deployable independently
- Use strict TypeScript configuration
- All scripts, utilities, and tooling must be TypeScript

## Common Commands

```bash
# Create new app
pnpm create-app <name>

# Start development for specific app
pnpm dev --filter=<app-name>

# Install dependencies for all apps
pnpm install

# Build all apps
pnpm build

# Run tests for specific app
pnpm test --filter=<app-name>

# Clean all node_modules
pnpm clean

# Update all dependencies
pnpm update -r
```

## AI Agent Development Tips

1. **TypeScript Only:** Never create JavaScript files - everything must be TypeScript
2. **Always read the app's CLAUDE.md** before making changes
3. **Use the standardized stack:**
   - **State:** Zustand for client-side state management
   - **Queries:** TanStack Query for data fetching
   - **UI:** shadcn/ui components only
   - **Tables:** TanStack Table for all data tables
   - **Forms:** Zod + React Hook Form for validation
   - **API:** tRPC for type-safe APIs
4. **Keep apps focused** - each should do one thing well
5. **Test in development** before deploying
6. **Update CLAUDE.md** when adding new features or dependencies
7. **Use shared components** when possible to maintain consistency
8. **Strict typing:** Use proper TypeScript types, avoid `any`
9. **Type safety:** Ensure all functions, variables, and components are properly typed
10. **Follow patterns:** Use existing patterns for state, queries, and UI components

## Next Steps

1. Set up the basic repository structure
2. Create the first example app (calculator)
3. Implement the navigation system
4. Create the app creation script
5. Test the workflow with a few more apps
