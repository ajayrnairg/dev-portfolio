# 10 — Full Data Flow Trace & Architecture Summary

## Data Flow Trace: User Visits `/work`

This is a step-by-step trace of exactly what happens when someone navigates to the Work page.

---

### Step 1: Route Navigation Triggered
User clicks the "work" icon in `Nav.js`.

```js
// Nav.js
<Link href="/work">  ← Next.js Link triggers client-side navigation
```

### Step 2: `_app.js` — Route Change Events
```js
router.events.on('routeChangeStart', () => setIsRouteLoading(true));
// → GlobalLoading spinner appears (z-[100] overlay)
```

### Step 3: `_app.js` — AnimatePresence
```jsx
<AnimatePresence mode="wait">
  <motion.div key="/work">   ← Key changes → previous page exits, new page enters
    <Transition />           ← 3-layer purple wipe animation plays
    <Work />                 ← pages/work/index.js renders
  </motion.div>
</AnimatePresence>
```

### Step 4: `Work` Component Mounts
```js
// pages/work/index.js
const [workData, setWorkData] = useState(null);

useEffect(() => {
  fetchWork();  // ← Called immediately on mount
}, []);
```

### Step 5: `workService.getWork()` is Called
```js
// services/workService.js
const response = await apiClient.get('/api/v1/work');
```

### Step 6: `apiClient` Request Interceptor
```js
// Before sending the HTTP request:
loadingService.increment();  // activeRequestCount = 1
// → notifies _app.js → setIsApiLoading(true)
// → GlobalLoading spinner stays visible

// Checks localStorage for JWT token
// → Not found (public route) → no Authorization header
```

### Step 7: HTTP Request Sent
```
GET https://portfolio-backend-fsqx.onrender.com/api/v1/work
Headers: { Content-Type: 'application/json' }
```
Backend is a Spring Boot app on Render. If it's sleeping, this may take 15-30 seconds.

### Step 8: Backend Responds
```json
{
  "description": "A curated selection of my technical builds...",
  "projects": [
    {
      "title": "High-Performance Developer Portfolio",
      "thumbnailPath": "/thumb1.jpg",
      "description": "...",
      "techStack": ["SiNextdotjs", "FaJava", "SiSpringboot", "SiPostgresql"],
      "ctaLinks": [
        { "title": "View Code", "url": "https://github.com/..." },
        { "title": "Live Demo", "url": "https://..." }
      ]
    }
  ]
}
```

### Step 9: `apiClient` Response Interceptor
```js
loadingService.decrement();  // activeRequestCount = 0
// → notifies _app.js → setIsApiLoading(false)
// → GlobalLoading spinner hides
```

### Step 10: `workService.getWork()` Returns
```js
return response.data;
// { description: "...", projects: [...] }
```

### Step 11: `Work` Component Updates State
```js
setWorkData(data);
setError(null);
setLoading(false);
```

### Step 12: Work Page Re-renders
```jsx
<motion.p>{workData.description}</motion.p>
<WorkSlider projects={workData.projects} />
```

### Step 13: `WorkSlider` Renders Projects
```js
const hasApiProjects = projects && projects.length > 0;  // → true

// Groups 4 projects per Swiper slide:
Array.from({ length: Math.ceil(projects.length / 4) }).map((_, slideIndex) => (
  <SwiperSlide>
    <div className="grid grid-cols-2 grid-rows-2">
      <ProjectCard project={projects[0]} />
      <ProjectCard project={projects[1]} />
      <ProjectCard project={projects[2]} />
      <ProjectCard project={projects[3]} />
    </div>
  </SwiperSlide>
))
```

### Step 14: `ProjectCard` Renders Each Project
```js
// "SiNextdotjs" → techStackIconMap["SiNextdotjs"] → SiNextdotjs component
const techs = getTechStackIcons(project.techStack);

// Render: Image + hover overlay + Radix Dialog for detail modal
```

### Step 15: Route Change Complete
```js
router.events.on('routeChangeComplete', () => setIsRouteLoading(false));
// isRouteLoading already false by now (API call handles its own spinner)
```

**User sees:** Work page with animated project slider, fully loaded.

---

## Architecture Summary

### Overall Pattern
This is a **Next.js 13 Pages Router** application — a full **Client-Side Rendered (CSR)** single-page-app experience, connected to a **Spring Boot REST API** backend.

There is **no Server-Side Rendering (SSR)** or **Static Site Generation (SSG)** in use — all data fetching happens in the browser via `useEffect`.

### Separation of Concerns

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│                                                  │
│  pages/           ← Route components             │
│  ├── Pages own state (useState, useEffect)       │
│  ├── Fetch via services layer on mount           │
│  └── Render via Tailwind + Framer Motion         │
│                                                  │
│  components/      ← Reusable UI components       │
│  ├── Decorative (Avatar, Bulb, Circles, etc.)    │
│  ├── Layout (Layout, Nav, Header)                │
│  └── Feature (WorkSlider, ServiceSlider, etc.)   │
│                                                  │
│  services/        ← Data layer                   │
│  ├── apiClient.js ← One Axios instance to rule   │
│  │                   all API calls               │
│  └── *Service.js  ← One service per domain       │
│                   (profile, about, work, etc.)   │
│                                                  │
│  variants.js      ← Centralized animation        │
│  styles/globals.css ← Design tokens              │
└─────────────────────────────────────────────────┘
              ↕ REST API (JSON)
┌─────────────────────────────────────────────────┐
│                    BACKEND                       │
│  Spring Boot REST API (Java)                     │
│  Hosted on: Render (free tier, sleeps)           │
│  Base URL: https://portfolio-backend-fsqx.onrender.com │
│                                                  │
│  Endpoints:                                      │
│  Public:  GET /api/v1/profile/getProfile         │
│           GET /api/v1/about                      │
│           GET /api/v1/work                       │
│           POST /api/v1/contact                   │
│  Admin:   All /api/v1/admin/* (JWT required)     │
└─────────────────────────────────────────────────┘
```

### State Management
There is **no global state library** (no Redux, no Zustand, no Context API).
- **Component-local state** via `useState` for all page data
- **One global concern** (loading) handled by `loadingService.js` using a custom observer/subscriber pattern
- Auth state is implicit: checked via `localStorage.getItem('jwt_token')` when needed

### Patterns That Repeat Everywhere

#### 1. API + Fallback Pattern (on every data page)
```js
useEffect(() => {
  try {
    const data = await someService.getData();
    setData(data);
  } catch (err) {
    setData(fallbackData);  // Never show a blank page
    setError(true);         // Optionally show warning
  } finally {
    setLoading(false);
  }
}, []);
```

#### 2. String → Icon Component Mapping (About & Work pages)
API returns icon names as strings. Frontend maps them to components:
```js
const iconMap = { FaJs: FaJs, SiSpringboot: SiSpringboot, ... };
const IconComponent = iconMap[stringFromAPI];
```

#### 3. Framer Motion Animation Pattern (every page)
```jsx
<motion.div variants={fadeIn('up', 0.2)} initial="hidden" animate="show">
  content
</motion.div>
```
Staggered delays (0.2, 0.4, 0.6...) create sequential reveal animations.

#### 4. Absolute Positioned Decorations
All visual decorations (Bulb, Circles, Avatar, TopLeftImg, Particles) are `absolute` positioned. Page content is `relative` and sits above them via z-index.

### Key Files to Know
| File | Why it matters |
|---|---|
| `pages/_app.js` | Root of everything — wraps all pages |
| `services/apiClient.js` | All HTTP traffic goes here |
| `services/loadingService.js` | The global spinner brain |
| `variants.js` | All animation configs live here |
| `tailwind.config.js` | All color/font/spacing tokens |
| `components/WorkSlider.js` | Most complex component (API + fallback + dialog) |
| `services/adminService.js` | All CMS operations (22 methods) |
