# 09 — Pages: Work & Admin Dashboard

## Files Covered
- `pages/work/index.js` — Work/Projects page
- `components/WorkSlider.js` — Project slider component
- `pages/adminKottaram/index.js` — Admin dashboard landing

---

## `pages/work/index.js` — Work Page

### State
```js
const [workData, setWorkData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### Data Fetching
```js
useEffect(() => {
  const data = await workService.getWork();
  setWorkData(data);
}, []);
```
If API fails → `error` is set to `true`, a yellow warning banner appears.

### Layout
```
<div h-full, centered>
  <Circles />          ← Decorative bottom-right circles

  <div container>
    <div flex (col on mobile, row on xl)>

      <!-- LEFT: Text Panel (30vw on xl) -->
      <motion.h2>  "Featured Engineering ."
      <motion.p>   workData.description or fallback
      {error && <warning banner>}

      <!-- RIGHT: Slider (65% on xl) -->
      <WorkSlider projects={workData?.projects} />
    </div>
  </div>

  <Bulb />             ← Decorative bottom-left bulb
</div>
```

---

## `components/WorkSlider.js` — The Project Slider

This is the most complex component in the project (444 lines). It handles both API data and fallback hardcoded data.

### Props
```js
const WorkSlider = ({ projects }) => { ... }
```
- `projects` — Array from the API response (or `undefined` if API failed)

### Decision: API vs Fallback
```js
const hasApiProjects = projects && Array.isArray(projects) && projects.length > 0;
```
If `hasApiProjects` is true → renders from API data
If false → renders from hardcoded `workSlides` object (8 projects across 2 slides)

### Tech Stack Icon Resolution
```js
const techStackIconMap = {
  'SiNextdotjs': SiNextdotjs,
  'FaJava': FaJava,
  'SiSpringboot': SiSpringboot,
  // ... 20 tech icons mapped
};

const getTechStackIcons = (techStackArray) => {
  return techStackArray.map(tech => {
    if (typeof tech === 'function') return tech;       // Already a component (fallback data)
    return techStackIconMap[tech] || null;             // String from API → component
  }).filter(Boolean);
};
```

### CTA Link Icon Resolution
```js
const getLinkIcon = (title) => {
  switch (title.toLowerCase()) {
    case 'view code':     return FaGithub;
    case 'live demo':     return VscLiveShare;
    case 'video demo':    return FaVideo;
    case 'research paper': return IoNewspaperOutline;
    default:              return FaGithub;
  }
};
```
The API sends `ctaLinks` with just `{ title, url }`. The icon is determined by the title string.

### Grid Layout (4 projects per slide)
```js
// API mode: group 4 projects per Swiper slide
Array.from({ length: Math.ceil(projects.length / 4) }).map((_, slideIndex) => (
  <SwiperSlide>
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      {projects.slice(slideIndex * 4, slideIndex * 4 + 4).map(project => (
        <ProjectCard project={project} />
      ))}
    </div>
  </SwiperSlide>
))
```
4 projects per slide in a 2x2 grid. If there are 8 projects → 2 slides.

### `ProjectCard` — Inner Component
Each card uses **Radix UI Dialog** for the detail modal:

```
<Dialog.Root>
  <Dialog.Trigger>           ← The card (image + hover overlay)
    <Image thumbnail />
    <div gradient overlay>   ← Appears on hover
    <div title + "VIEW DETAILS" arrow>
  </Dialog.Trigger>

  <Dialog.Content>           ← Modal popup
    <Dialog.Title>project.title
    <Dialog.Description>
      <Flex column>
        <TechStack icons row>    ← Resolved icon components
        <Description text>       ← project.description
        <CTA buttons row>        ← project.ctaLinks → opens in new tab
      </Flex>
  </Dialog.Content>
</Dialog.Root>
```

### Swiper Configuration
```js
<Swiper
  breakpoints={{
    320: { direction: 'vertical' },    // Mobile: vertical swipe
    640: { direction: 'horizontal' },  // Desktop: horizontal swipe
  }}
  spaceBetween={10}
  pagination={{ clickable: true }}
  modules={[Pagination]}
  className="h-[280px] sm:h-[480px]"
>
```

### Hover Animation on Cards
- Gradient overlay (`via-[#e838cc] to-[#4a22bd]`) fades in: `opacity-0 group-hover:opacity-80`
- Title + "VIEW DETAILS" text slides up from below: `translate-y-full group-hover:-translate-y-10`

---

## `pages/adminKottaram/index.js` — Admin Dashboard

### Access Control
```js
useEffect(() => {
  if (!authService.isAuthenticated()) {
    window.location.href = '/login';  // Hard redirect if not logged in
    return;
  }
  setIsAuthenticated(true);
  setLoading(false);
}, []);
```
The admin dashboard is a **client-side protected route**. It checks for the JWT token in localStorage on mount and redirects to `/login` if absent.

> **Note**: There is no `/login` page in the current `pages/` directory — this would need to be created.

### Admin Sections
The dashboard renders a 2x2 grid of navigation cards:

| Title | Path | Color |
|---|---|---|
| Profile Management | `/adminKottaram/profile` | Blue → Cyan |
| About Section | `/adminKottaram/about` | Green → Emerald |
| Work/Projects | `/adminKottaram/work` | Purple → Pink |
| Contact Messages | `/adminKottaram/contact` | Orange → Red |

> **Important**: These sub-pages (`/adminKottaram/profile`, `/adminKottaram/about`, `/adminKottaram/work`, `/adminKottaram/contact`) exist in the backend service map but their actual Next.js page files are in the `adminKottaram` folder (the detailed files `about.js`, `work.js`, `profile.js`, `contact.js`).

### Logout
```js
const handleLogout = () => {
  authService.logout();        // Removes JWT from localStorage
  window.location.href = '/'; // Redirect to home
};
```

### Layout
```
<div>
  <Circles />   ← Decorative

  <div container, flex (col on mobile, row on xl)>

    <!-- LEFT: Welcome text -->
    <motion.h2>  "Admin Dashboard"
    <motion.p>   Description
    <button>     Logout (red, bottom-left)

    <!-- RIGHT: Section cards grid (2x2) -->
    <div grid-cols-2>
      <Link href="/adminKottaram/profile">
        <card: icon + title + description>
      <Link href="/adminKottaram/about">
        <card: icon + title + description>
      <Link href="/adminKottaram/work">
        <card: icon + title + description>
      <Link href="/adminKottaram/contact">
        <card: icon + title + description>
    </div>
  </div>
</div>
```

### Card Hover Effect
Each card has:
- `hover:border-accent/50` — Border turns teal on hover
- `group-hover:scale-110` on icon — Icon scales up
- `group-hover:text-accent` on title — Title turns teal
- Opacity-0 arrow `→` that appears on hover (`group-hover:opacity-100`)
