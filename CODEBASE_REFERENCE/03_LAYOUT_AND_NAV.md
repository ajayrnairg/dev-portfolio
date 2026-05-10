# 03 — Layout System & Navigation

## Files Covered
- `components/Layout.js`
- `components/Header.js`
- `components/Nav.js`
- `components/Transition.js`

---

## `components/Layout.js` — The Page Shell

Every page is wrapped by this component (via `_app.js`). It sets up:

```jsx
const Layout = ({ children }) => {
  return (
    <div className="page bg-site text-white bg-cover bg-no-repeat font-sora relative">
      <TopLeftImg />     ← Decorative image (top-left corner)
      <Nav />            ← Vertical sidebar nav (desktop) / bottom nav (mobile)
      <Header />         ← Top bar with Logo + Socials
      {children}         ← The actual page content goes here
    </div>
  );
};
```

### Font Loading
```js
const sora = Sora({
  subsets: ['latin'],
  variables: '--font-sora',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
});
```
The Sora font is loaded via `@next/font/google` (optimized, no layout shift). It's applied as a CSS variable and used via the `font-sora` Tailwind class.

### The `.page` class (from globals.css)
```css
.page { @apply w-full h-screen overflow-hidden; }
```
This makes every page exactly viewport-sized. Content that needs to scroll uses internal overflow containers.

---

## `components/Header.js` — Top Bar

Positioned **absolutely** at the top of every page (`absolute z-30 w-full`).

### Structure
```
<header>
  <div container>
    <Link href="/">        ← Logo → navigates home
      <Image src="/englishLogo.png" />
    </Link>

    {!isAdminRoute && <Socials />}    ← Hidden on admin pages
  </div>
</header>
```

### Admin Route Detection
```js
const isAdminRoute = router.pathname.startsWith('/adminKottaram');
```
The social icons in the header are **hidden** on all `/adminKottaram/*` pages to keep the admin UI clean.

### Important CSS
- `pointer-events-none` on the header container — the header doesn't block clicks on the page behind it.
- `pointer-events-auto` on individual clickable elements (Logo, Socials) to re-enable clicks.

---

## `components/Nav.js` — Navigation Sidebar / Bottom Bar

The nav is **responsive**:
- **Desktop (xl+)**: Fixed vertical sidebar on the right side of the screen
- **Mobile**: Fixed horizontal bottom bar

### Navigation Links (Active routes shown with accent color)
```js
const navData = [
  { name: 'home',    path: '/',        icon: <HiHome /> },
  { name: 'about',   path: '/about',   icon: <HiUser /> },
  { name: 'work',    path: '/work',    icon: <HiViewColumns /> },
  { name: 'contact', path: '/contact', icon: <HiEnvelope /> },
];
// NOTE: 'services' and 'testimonials' routes are commented out
```

### Active Link Highlighting
```js
// If current path matches the link's path, apply accent color
className={`${link.path === pathname && 'text-accent'} ...`}
```

### Desktop Tooltip
On hover (desktop only), a white tooltip with the link name appears to the left of the icon:
```jsx
<div className="absolute pr-14 right-0 hidden xl:group-hover:flex">
  <div className="bg-white text-primary p-[6px] rounded-[3px]">
    {link.name}
  </div>
</div>
```

### Nav Layout Classes
```
Desktop: fixed h-max, right-[2%], z-50, xl:h-screen → vertical pill on the right
Mobile:  fixed bottom-0, h-[80px], full width, horizontal row
```

---

## `components/Transition.js` — Page Wipe Animation

This renders **3 layered divs** that animate in/out when navigating between pages.

```jsx
const transitionVariants = {
  initial: { x: '100%', width: '100%' },  // Starts off-screen to the right
  animate: { x: '0%',   width: '0%'   },  // Wipes across then collapses
  exit:    { x: ['0%', '100%'], width: ['0%', '100%'] },  // Reverses
};
```

### The 3 Layers (staggered delays)
| Layer | z-index | Color | Delay |
|---|---|---|---|
| Layer 1 | z-30 | `#2e2257` (darkest purple) | 0.1s |
| Layer 2 | z-20 | `#3b2d71` (mid purple) | 0.2s |
| Layer 3 | z-10 | `#4b3792` (lightest purple) | 0.3s |

The staggered delays create a "triple wipe" visual effect during page transitions.

### Where it's used
`Transition.js` is rendered inside `_app.js` directly inside the `<motion.div key={router.route}>`. It runs on **every** route change automatically.

---

## Component Hierarchy (Visual)

```
_app.js
└── <Theme>
    └── <Layout>
        ├── <TopLeftImg />          ← Decorative (corner image)
        ├── <Nav />                 ← Fixed sidebar/bottom nav
        ├── <Header>                ← Absolute top bar
        │   ├── Logo Link
        │   └── <Socials />        ← Hidden on admin routes
        └── {children}             ← Animated page content
            ├── <GlobalLoading />  ← z-100 overlay spinner
            ├── <AnimatePresence>
            │   └── <motion.div key={route}>
            │       ├── <Transition />   ← 3-layer page wipe
            │       └── <Page Component />
            └── <Analytics />
```
