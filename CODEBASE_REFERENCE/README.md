# Codebase Reference — Index

This folder contains 10 reference documents covering the entire dev-portfolio codebase.
Read them in order for a complete mental model.

---

## Reading Order

| # | File | What it covers |
|---|---|---|
| 01 | [01_PROJECT_IDENTITY.md](./01_PROJECT_IDENTITY.md) | Tech stack, dependencies, Tailwind config, animation system (`variants.js`) |
| 02 | [02_APP_ENTRY_AND_GLOBALS.md](./02_APP_ENTRY_AND_GLOBALS.md) | `_app.js` bootstrapping, loading states, Radix theme, global CSS |
| 03 | [03_LAYOUT_AND_NAV.md](./03_LAYOUT_AND_NAV.md) | Layout shell, Header, Nav sidebar/mobile, page transition animation |
| 04 | [04_UI_COMPONENTS.md](./04_UI_COMPONENTS.md) | All shared components: Avatar, Bulb, Circles, Particles, Socials, etc. |
| 05 | [05_SERVICES_FOUNDATION.md](./05_SERVICES_FOUNDATION.md) | `apiClient.js` (Axios), `loadingService.js`, `authService.js`, barrel export |
| 06 | [06_DATA_SERVICES.md](./06_DATA_SERVICES.md) | `profileService`, `aboutService`, `workService`, `contactService` + API shapes |
| 07 | [07_ADMIN_SERVICE.md](./07_ADMIN_SERVICE.md) | Complete `adminService.js` — all 22 CRUD operations with endpoints |
| 08 | [08_PAGES_HOME_ABOUT_CONTACT.md](./08_PAGES_HOME_ABOUT_CONTACT.md) | Home, About, Contact pages — state, data flow, layout, interactions |
| 09 | [09_PAGES_WORK_AND_ADMIN.md](./09_PAGES_WORK_AND_ADMIN.md) | Work page, WorkSlider component, Admin dashboard |
| 10 | [10_ARCHITECTURE_AND_DATA_FLOW.md](./10_ARCHITECTURE_AND_DATA_FLOW.md) | Full `/work` page trace (15 steps) + overall architecture diagram |

---

## Quick Reference

### Project
- **Framework**: Next.js 13 (Pages Router, CSR)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion (`variants.js` → `fadeIn(direction, delay)`)
- **Backend**: Spring Boot API on Render → `https://portfolio-backend-fsqx.onrender.com`

### Colors
| Token | Value |
|---|---|
| `primary` | `#0F172A` (dark navy) |
| `secondary` | `#8B5CF6` (violet, used as body bg) |
| `accent` | `#2DD4BF` (teal, used for highlights) |

### Public API Endpoints
| Endpoint | Service | Used by |
|---|---|---|
| `GET /api/v1/profile/getProfile` | `profileService.getProfile()` | Home, Socials |
| `GET /api/v1/profile/resume/download` | `profileService.downloadResume()` | ProjectsBtn |
| `GET /api/v1/about` | `aboutService.getAbout()` | About page |
| `GET /api/v1/work` | `workService.getWork()` | Work page |
| `POST /api/v1/contact` | `contactService.sendMessage()` | Contact page |

### Protected API Endpoints (JWT required)
All under `/api/v1/admin/*` — see `07_ADMIN_SERVICE.md`

### Nav Routes (active)
- `/` — Home
- `/about` — About
- `/work` — Work
- `/contact` — Contact
- `/adminKottaram` — Admin (protected, redirects to `/login` if no token)
