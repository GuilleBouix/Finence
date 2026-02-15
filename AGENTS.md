# AGENTS.md - Developer Guidelines for This Project

## Project Overview
This is a React 19 + TypeScript + Vite application with Supabase authentication, TailwindCSS v4, and Zustand for state management. It uses the React Compiler (Babel plugin).

## Build, Lint, and Test Commands

### Development
```bash
pnpm dev          # Start development server with HMR
pnpm build        # Type-check and build for production
pnpm lint         # Run ESLint on all files
pnpm preview      # Preview production build locally
```

### Running a Single Test
No test framework is currently configured. To add tests, use Vitest:
```bash
pnpm add -D vitest @vitest/ui jsdom
# Then run: pnpm vitest run --single-thread
# Or with UI: pnpm vitest --ui
```

### Type Checking
```bash
pnpm tsc -b       # Build with TypeScript (type-check + emit)
```

## Code Style Guidelines

### General Rules
- **Language**: English for code, Spanish for user-facing text (comments, UI labels)
- **Strict TypeScript**: All strict checks enabled in tsconfig.app.json
- **No unused**: Remove unused variables, imports, and parameters
- **ES Modules**: Use `verbatimModuleSyntax` - import with extensions

### File Organization
```
src/
├── components/     # Reusable UI components
├── layouts/        # Layout wrappers (e.g., ProtectedRoute)
├── pages/          # Route page components
├── services/      # Supabase client, API calls
├── store/         # Zustand stores
├── types/         # TypeScript interfaces/types
├── globals.css    # TailwindCSS + global styles
├── App.tsx        # Root component with routing
└── main.tsx       # Entry point
```

### Imports
```typescript
// Order: external → internal → relative
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import type { Movimiento } from '../types/finance'
import { Header } from '../components/Header'

// Named exports for utilities, default for components
export const formatCurrency = () => { }
export default function Login() { }
```

### Naming Conventions
- **Components**: PascalCase (`Header.tsx`, `TransactionForm.tsx`)
- **Files**: camelCase (`supabaseClient.ts`, `useFinanceStore.ts`)
- **Interfaces**: PascalCase with descriptive names (`Movimiento`, `Totales`)
- **State**: Spanish naming used in this codebase (`cargando`, `mensaje`, `correo`)
- **Functions**: camelCase, use verbs (`manejarLogin`, `obtenerDatos`)
- **Constants**: SCREAMING_SNAKE_CASE for config values

### TypeScript Guidelines
- Use `type` for unions/intersections, `interface` for objects
- Use `import type { ... }` for type-only imports
- Enable `strict: true` - no `any` unless absolutely necessary
- Define interfaces in `src/types/` for shared types
- Component props: inline type or import from types file

```typescript
// Good
interface FinanceState {
    ingresos: Movimiento[]
    gastos: Movimiento[]
    obtenerDatos: (userId: string) => Promise<void>
}

// Component with inline props type
export const TransactionForm = ({ onAdd, cargando }: { onAdd: any, cargando: boolean }) => {
```

### React Patterns
- Use functional components with hooks
- Use `useState` for local state, Zustand for global state
- Event handlers: named with `manejar` prefix (Spanish)
- Cleanup subscriptions in `useEffect` return
- Use `React.JSX.Element` for component return types when needed

```typescript
// State
const [cargando, setCargando] = useState(false)

// Effect with cleanup
useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
    return () => subscription.unsubscribe()
}, [])
```

### TailwindCSS v4
- Use arbitrary values sparingly (`bg-[#111]`, `animate-fade`)
- Keep classes organized: layout → sizing → visual → interactive
- Use CSS variables from globals.css for colors
- Available utilities: animations (`animate-fade`), transitions

### Error Handling
- Supabase errors: check `error` object from responses
- Display user-friendly messages via state (`mensaje`)
- Use try/catch for async operations
- Set loading states during async operations

```typescript
const { error } = await supabase.from('ingresos').select('*')
if (error) {
    setMensaje({ texto: error.message, tipo: 'error' })
    return
}
```

### State Management (Zustand)
- Create stores in `src/store/`
- Use `create<StateInterface>()` with TypeScript
- Include loading states in store
- Prefer optimistic updates or refetch after mutations

```typescript
export const useFinanceStore = create<FinanceState>((set, get) => ({
    ingresos: [],
    obtenerDatos: async (userId) => { /* ... */ }
}))
```

### Routing
- Use `react-router-dom` v7
- Public routes: `/auth`
- Protected routes: wrap with `ProtectedRoute` component
- Use `Navigate` with `replace` for redirects

### ESLint Configuration
The project uses:
- `@eslint/js` - recommended JS rules
- `typescript-eslint` - TypeScript support
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - HMR-safe code checks

Run `pnpm lint` before committing. Fix errors automatically where possible:
```bash
pnpm lint --fix
```

### React Compiler
This project uses React Compiler (Babel). Ensure mutations are explicit:
- Use local state for component-only data
- Zustand for cross-component state
- Avoid implicit side effects in render

### Secrets Management
- Never commit `.env` files or API keys
- Supabase credentials are currently hardcoded in `supabaseClient.ts` for demo
- In production, use environment variables: `import.meta.env.VITE_SUPABASE_URL`

### Common Pitfalls
1. **No `any` types**: Define proper interfaces instead
2. **Missing cleanup**: Always unsubscribe from Supabase listeners
3. **Strict mode effects**: `useEffect` may run twice in dev
4. **Tailwind classes**: Use arbitrary values sparingly
5. **Loading states**: Always handle async operations with loading UI
