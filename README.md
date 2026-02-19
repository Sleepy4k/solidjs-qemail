# QEmail Frontend 🚀

Modern temporary email service frontend built with **SolidJS**, **TypeScript**, and **Tailwind CSS**. Features a Gen Z-friendly landing page, real-time inbox, and a powerful admin panel. All animations are powered by **GSAP** for smooth 60fps performance.

## ✨ Features

### User Features
- 🚀 **Instant Email Generation** - Create temporary email addresses in seconds
- 📬 **Real-time Inbox** - View incoming emails instantly
- 🔒 **Privacy-focused** - No registration required
- ⚡ **Lightning Fast** - Built with SolidJS for optimal performance
- 🎭 **GSAP Animations** - Professional 60fps animations

### Technical Features
- 🎯 **Performance Optimized** - Uses refs instead of excessive state
- 🔐 **Admin Panel** - Complete CRUD operations for domains and accounts
- 🛡️ **Auth Guards** - Protected routes with JWT authentication
- 📦 **Code Splitting** - Lazy loaded routes for faster initial load
- 🎨 **Design System** - Consistent UI components with variants

## 🛠️ Tech Stack

- **SolidJS 1.8.11** - Reactive UI framework (signals-based)
- **TypeScript 5.3.3** - Type-safe development
- **GSAP 3.14.2** - Professional animation library
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Vite 5.0.11** - Fast development & build tool
- **Bun** - Package manager and runtime
- **@solidjs/router 0.15.4** - Client-side routing

## Getting Started

### Prerequisites

- Bun v1.0.0 or higher
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure (Enterprise)

```
src/
├── app/
│   └── App.tsx                    # Main router & lazy loading
│
├── shared/                         # Shared across all features
│   ├── components/
│   │   └── ui/                    # Base UI components
│   │       ├── Alert.tsx          # Toast notifications
│   │       ├── Button.tsx         # Button with ripple effect
│   │       ├── Card.tsx           # Card with animations
│   │       ├── Input.tsx          # Form input
│   │       ├── Modal.tsx          # Modal dialog
│   │       └── Select.tsx         # Select dropdown
│   │
│   ├── services/
│   │   └── http.service.ts        # HTTP client with interceptors
│   │
│   ├── utils/
│   │   ├── animation.util.ts      # GSAP animation functions
│   │   ├── format.util.ts         # Formatting helpers
│   │   └── validation.util.ts     # Validation rules
│   │
│   ├── guards/
│   │   └── auth.guard.tsx         # AdminGuard & GuestGuard
│   │
│   └── constants/
│       ├── api.constant.ts        # API endpoints
│       └── routes.constant.ts     # Route paths
│
├── features/                       # Feature modules (self-contained)
│   ├── admin/                      # Admin panel feature
│   │   ├── components/            # Admin-specific components
│   │   ├── layouts/               # AdminLayout with sidebar
│   │   ├── pages/                 # Dashboard, Domains, Accounts, etc.
│   │   ├── services/              # Admin API service
│   │   ├── stores/                # Admin auth store
│   │   └── types/                 # Admin types
│   │
│   ├── landing/                    # Landing page feature (Gen Z)
│   │   ├── components/            # LandingComponents (FeatureCard, etc.)
│   │   └── pages/                 # LandingPage
│   │
│   └── inbox/                      # Inbox feature (WIP)
│       └── pages/
│           └── InboxPage.tsx
│
├── pages/                          # Top-level pages only
│   └── NotFoundPage.tsx           # 404 page
│
├── index.tsx                       # Entry point
└── index.css                       # Global styles + Tailwind
```

### Architecture Principles

1. **Feature-based Structure**: Each feature is self-contained with its own components, services, and types
2. **Shared Layer**: Common utilities, components, and services accessible to all features
3. **Lazy Loading**: Routes are lazy loaded for optimal bundle size
4. **Refs over State**: Using refs instead of signals where possible to avoid unnecessary re-renders
5. **Service Layer**: HTTP service with request/response interceptors for auth and error handling

## 🔌 API Integration

The frontend connects to the backend API. Configure the API URL in `.env`:

```bash
VITE_API_URL=http://localhost:3000
```

### Public Endpoints
- `GET /v1/email/domains` - List available domains
- `POST /v1/email/generate` - Generate temporary email
- `GET /v1/email/inbox/:token` - Get inbox emails
- `GET /v1/email/inbox/:token/:messageId` - Get specific email
- `DELETE /v1/email/inbox/:token/:messageId` - Delete email

### Admin Endpoints (Protected)
- `POST /v1/admin/login` - Admin authentication
- `GET /v1/admin/stats` - Dashboard statistics
- `GET /v1/admin/domains` - List all domains (paginated)
- `POST /v1/admin/domains` - Create new domain
- `PUT /v1/admin/domains/:id` - Update domain
- `DELETE /v1/admin/domains/:id` - Delete domain
- `GET /v1/admin/accounts` - List all accounts
- `POST /v1/admin/accounts` - Create account
- `PUT /v1/admin/accounts/:id` - Update account
- `DELETE /v1/admin/accounts/:id` - Delete account

**Authentication**: Admin routes require `Authorization: Bearer <token>` header. The HTTP service automatically injects the token from localStorage.

## 🎨 GSAP Animations

All animations are powered by GSAP for 60fps performance:

```tsx
import { fadeIn, scaleIn, slideInLeft } from "@/shared/utils/animation.util";

const MyComponent = () => {
  let elementRef: HTMLDivElement | undefined;

  onMount(() => {
    if (elementRef) {
      fadeIn(elementRef, { duration: 0.8 });
    }
  });

  return <div ref={elementRef}>Animated content</div>;
};
```

### Available Animations
- `fadeIn()` - Fade in with y-translation
- `fadeOut()` - Fade out with y-translation
- `slideInLeft()` - Slide from left
- `slideInRight()` - Slide from right
- `scaleIn()` - Scale up entrance
- `bounce()` - Bounce effect
- `pulse()` - Pulse effect
- `shake()` - Shake effect
- `staggerFadeIn()` - Stagger multiple elements
- `rotateInfinite()` - Infinite rotation

## ⚡ Performance Optimization

### 1. Refs Instead of Signals

```tsx
// ❌ Bad: Unnecessary re-renders
const [inputValue, setInputValue] = createSignal('');

// ✅ Good: Direct DOM access
let inputRef: HTMLInputElement;
const getValue = () => inputRef.value;
```

### 2. Lazy Loading

```tsx
// Routes are lazy loaded
const LandingPage = lazy(() => import("../features/landing/pages/LandingPage"));
```

### 3. Code Splitting

Current bundle sizes (gzipped):
- Main bundle: 46.71 KB
- Landing page: 3.84 KB
- Styles: 7.24 KB

**Total:** ~58 KB (excellent!)

### 4. Minimal State

Only use signals for:
- Auth state (admin token + user)
- Server-synced data
- UI state that affects multiple components

Everything else uses refs or local variables.

## 🎯 Usage Examples

### Using Shared Components

```tsx
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Input } from "@/shared/components/ui/Input";

<Card>
  <Input
    label="Email"
    type="email"
    placeholder="your@email.com"
  />
  <Button variant="primary" size="lg">
    Generate Email
  </Button>
</Card>
```

### Using HTTP Service

```tsx
import { httpService } from "@/shared/services/http.service";

const fetchDomains = async () => {
  try {
    const domains = await httpService.get<Domain[]>("/v1/email/domains");
    return domains;
  } catch (error) {
    console.error("Failed to fetch domains:", error);
  }
};
```

### Creating Guards

```tsx
import { AdminGuard } from "@/shared/guards/auth.guard";

<Route path="/admin" component={AdminLayout}>
  <Route path="/" component={() => (
    <AdminGuard>
      <DashboardPage />
    </AdminGuard>
  )} />
</Route>
```

## 📚 Documentation

- [Landing Page Details](LANDING_PAGE.md) - Gen Z design details
- [Refactoring Summary](REFACTORING_SUMMARY.md) - Complete refactoring breakdown
- [Project Structure](PROJECT_STRUCTURE.md) - Detailed structure explanation
- [Architecture](ARCHITECTURE.md) - Architecture decisions
- [Design System](DESIGN_SYSTEM.md) - Design tokens and components
- [Admin Guide](ADMIN_GUIDE.md) - Admin panel usage

## 🛠️ Development

### Adding a New Feature

1. Create feature folder:
```bash
mkdir -p src/features/my-feature/{components,pages,services,stores,types}
```

2. Create page component:
```tsx
// src/features/my-feature/pages/MyPage/MyPage.tsx
export const MyPage = () => {
  return <div>My Feature</div>;
};
```

3. Register route:
```tsx
// src/app/App.tsx
const MyPage = lazy(() => import("../features/my-feature/pages/MyPage"));

<Route path="/my-feature" component={MyPage} />
```

### Adding Shared Component

1. Create component in `src/shared/components/ui/`:
```tsx
// src/shared/components/ui/MyComponent.tsx
export const MyComponent: Component<Props> = (props) => {
  return <div>{props.children}</div>;
};
```

2. Export from index (optional):
```tsx
// src/shared/components/ui/index.ts
export { MyComponent } from "./MyComponent";
```

## 🎨 Customization

### Tailwind Config

Edit [tailwind.config.js](tailwind.config.js) for:
- Colors
- Typography
- Spacing
- Animations

### GSAP Defaults

Edit [animation.util.ts](src/shared/utils/animation.util.ts) for:
- Default durations
- Easing functions
- Animation presets

## 🚀 Deployment

### Build for Production

```bash
bun run build
```

Output in `dist/` folder.

### Preview Production Build

```bash
bun run preview
```

### Deploy to Cloudflare Pages

```bash
# Build
bun run build

# Deploy
wrangler pages deploy dist
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🧪 Testing (Future)

Structure is ready for:
- Unit tests (Vitest)
- Component tests (@solidjs/testing-library)
- E2E tests (Playwright)

```bash
# Install testing deps
bun add -D vitest @solidjs/testing-library @testing-library/jest-dom

# Run tests
bun test
```

## 📊 Bundle Analysis

```bash
# Install analyzer
bun add -D rollup-plugin-visualizer

# Build with stats
bun run build -- --mode analyze
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (2 spaces)
- **Linting**: ESLint
- **Naming**: 
  - Components: PascalCase
  - Files: kebab-case (folders), PascalCase (components)
  - Functions: camelCase
  - Constants: SCREAMING_SNAKE_CASE

## 🐛 Troubleshooting

### Port 5173 already in use

```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9

# Or use different port
bun run dev -- --port 3001
```

### Build fails

```bash
# Clear cache
rm -rf node_modules .vite dist
bun install
bun run build
```

### GSAP not working

Make sure to import GSAP utilities:

```tsx
import { fadeIn } from "@/shared/utils/animation.util";
```
