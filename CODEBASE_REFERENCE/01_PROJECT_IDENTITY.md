# 01 — Project Identity, Config & Animation System

## What is this project?
A **Next.js 13 portfolio website** for a Full Stack Developer (Ajay Nair). It is a client-side rendered app connected to a **custom Spring Boot REST API backend** hosted on Render (`https://portfolio-backend-fsqx.onrender.com`).

---

## `package.json` — Dependencies at a Glance

| Package | Purpose |
|---|---|
| `next@13.4.3` | Core framework (App Router NOT used — uses `/pages` router) |
| `react@18.2.0` | UI library |
| `framer-motion@10` | Page transitions and element animations |
| `axios@1.14` | HTTP client for API calls |
| `swiper@9` | Touch-friendly image/project sliders |
| `react-tsparticles` + `tsparticles` | Animated particle canvas on the home page |
| `react-icons@4.8` | Icon sets (HeroIcons, SimpleIcons, FontAwesome, etc.) |
| `react-countup@6` | Animated number counting (used on About page) |
| `@radix-ui/themes@3` | Pre-built accessible dialog/button components (used in WorkSlider) |
| `@next/font@13` | Optimized Google Font loading |
| `tailwind-scrollbar` | Custom styled scrollbars |
| `@vercel/analytics` | Page view tracking (Vercel Analytics) |

---

## `next.config.js` — What's configured?

```js
const nextConfig = {
  reactStrictMode: true,   // Flags potential issues during development
  swcMinify: true,         // Uses Rust-based compiler for faster minification
  eslint: {
    ignoreDuringBuilds: true,  // ESLint errors won't block the production build
  }
}
```

> **Key insight**: `ignoreDuringBuilds: true` means you can deploy even with lint errors. Good for speed, but be careful — linting must be done manually.

---

## `tailwind.config.js` — Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `primary` | `#0F172A` | Dark navy — main page backgrounds |
| `secondary` | `#8B5CF6` | Violet — used as `body` background color |
| `accent` | `#2DD4BF` | Cyan/teal — highlights, active nav links, CTA buttons |

### Custom Background Images (used via Tailwind utility classes)
| Class | Image File |
|---|---|
| `bg-explosion` | `/bg-explosion.png` |
| `bg-circles` | `/bg-circles.png` |
| `bg-circleStar` | `/circle-star.svg` (used in the spinning ProjectsBtn) |
| `bg-site` | `/site-bg.svg` (main page background texture) |

### Fonts
- `font-sora` → Loaded via `@next/font` in `Layout.js`
- `font-poppins` → Available but not actively loaded (secondary)

### Custom Animation
- `animate-spin-slow` → 6-second slow spin used on the `ProjectsBtn` circular text image

### Breakpoints
| Name | Width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 960px |
| `xl` | 1200px |

---

## `variants.js` — The Animation System

This file exports a single Framer Motion **variant factory** used across the entire app.

```js
export const fadeIn = (direction, delay) => {
  return {
    hidden: {
      y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
      x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
      opacity: 0,
      // Eases out slowly
      transition: { type: 'tween', duration: 1.5, delay, ease: [0.25, 0.6, 0.3, 0.8] }
    },
    show: {
      y: 0, x: 0, opacity: 1,
      // Standard ease-in
      transition: { type: 'tween', duration: 1.4, delay, ease: [0.25, 0.25, 0.25, 0.75] }
    }
  };
};
```

### How to use it (pattern seen everywhere in pages):
```jsx
import { fadeIn } from '../../variants';

<motion.h2
  variants={fadeIn('up', 0.2)}   // direction, delay in seconds
  initial="hidden"
  animate="show"
>
  Title text
</motion.h2>
```

**Directions**: `'up'`, `'down'`, `'left'`, `'right'`
**Delay**: Staggers elements so they animate in sequence (e.g., 0.2, 0.4, 0.6 seconds)

---

## Summary
- This is a **Next.js 13 Pages Router** project with **Tailwind CSS** for styling.
- Animations run entirely via **Framer Motion** using the centralized `fadeIn` variant from `variants.js`.
- The design system is defined in `tailwind.config.js` with three core colors: `primary`, `secondary`, `accent`.
- All API calls go to a **Spring Boot backend on Render** via **Axios**.
