# 02 — App Entry Point & Global Shell

## Files Covered
- `pages/_app.js` — The root wrapper for every page
- `styles/globals.css` — Global CSS applied site-wide

---

## `pages/_app.js` — How the App Bootstraps

Every Next.js app has a `_app.js` that wraps all pages. Think of it as the outermost shell.

### What's rendered at the top level:
```
<Theme>           ← Radix UI dark theme provider
  <Layout>        ← Sora font, TopLeftImg, Nav, Header
    <GlobalLoading />       ← Spinner overlay during loading
    <AnimatePresence>       ← Framer Motion route transition manager
      <motion.div key={route}>   ← Triggers animation on route change
        <Transition />      ← 3-layer animated page wipe effect
        <Component />       ← The actual page being visited
        <Analytics />       ← Vercel analytics tracking
      </motion.div>
    </AnimatePresence>
  </Layout>
</Theme>
```

### Loading State Management (Two Sources)
The app tracks two independent loading states:

```js
const [isApiLoading, setIsApiLoading] = useState(false);   // From API calls
const [isRouteLoading, setIsRouteLoading] = useState(false); // From navigation
const isLoading = isApiLoading || isRouteLoading;
```

**Source 1 — API Loading** (via `loadingService`):
```js
useEffect(() => {
  const unsubscribe = loadingService.subscribe(setIsApiLoading);
  return unsubscribe; // Cleanup on unmount
}, []);
```
Every axios request increments a counter in `loadingService`, which notifies `_app.js` to show the spinner.

**Source 2 — Route Loading** (via Next.js router events):
```js
router.events.on('routeChangeStart', () => setIsRouteLoading(true));
router.events.on('routeChangeComplete', () => setIsRouteLoading(false));
router.events.on('routeChangeError', () => setIsRouteLoading(false));
```
Whenever you click a link and Next.js starts loading a new page, the spinner appears.

### Radix UI Theme Provider
```jsx
<Theme appearance="dark" accentColor='#2DD4BF' radius="large">
```
- Forces dark mode across all Radix components (dialogs, buttons, etc.)
- The `accentColor` of `#2DD4BF` matches the site's accent teal color.

### Page Transition Flow
When you navigate from `/about` to `/work`:
1. `AnimatePresence` detects the route key changed
2. The exiting `motion.div` triggers its `exit` animation (page wipes out)
3. `Transition.js` renders its 3-layer wipe-in effect on the new page
4. The new page fades/animates in via Framer Motion variants

---

## `styles/globals.css` — Global Styles

### Tailwind Directives
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
These inject Tailwind's base reset, component utilities, and utility classes.

### Swiper Overrides
```css
/* Pagination dots */
.swiper-pagination-bullet { background-color: #f13024; }

/* Navigation arrows */
.swiper-button-next:after, .swiper-button-prev:after { color: #f13024; }
```
The Swiper slider's pagination dots and arrows are overridden to a red/coral color `#f13024`.

### Custom Base Layer Classes
Defined inside `@layer base` — these are reusable class names used throughout the app:

| Class | What it does |
|---|---|
| `body` | Sets background to `bg-secondary` (#8B5CF6 violet), hides overflow |
| `.page` | Full-screen page wrapper (`w-full h-screen overflow-hidden`) |
| `.h1` | Hero heading — 35px mobile, 60px desktop, semibold |
| `.h2` | Section heading — 35px mobile, 54px desktop, semibold |
| `p` | Paragraph text — light font, 60% white opacity |
| `.btn` | Button height: 52px |
| `.input` | Transparent input field with border + focus ring |
| `.textarea` | Transparent textarea, 180px tall, no resize |

### CSS Utility
```css
.translate-z-0 { transform: translateZ(0px); }
```
Forces GPU compositing on elements (used in `ParticlesContainer` and `Avatar` to improve performance).

---

## Key Patterns to Remember
1. **Every page is wrapped by** `Layout` → `_app.js`. You never need to add Nav or Header to individual pages.
2. **The global spinner** appears automatically on any API call thanks to `loadingService` — no manual spinner code needed in pages.
3. **Page transitions** are handled automatically via `AnimatePresence` + `Transition.js`. Individual pages only need their own `motion` element animations.
