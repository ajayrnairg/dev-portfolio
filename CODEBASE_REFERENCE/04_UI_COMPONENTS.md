# 04 — UI Decoration & Shared Interactive Components

## Files Covered
- `components/Avatar.js`
- `components/Bulb.js`
- `components/Circles.js`
- `components/TopLeftImg.js`
- `components/ParticlesContainer.js`
- `components/ProjectsBtn.js`
- `components/Socials.js`
- `components/ThemeButton.js`
- `components/GlobalLoading.js`

---

## Decorative Visual Components

These components are pure visual — they render static images or effects to give the site its premium feel.

### `Avatar.js` — Developer Portrait
```jsx
// Only visible on XL screens (desktop)
<div className="hidden xl:flex xl:max-w-none">
  <Image src="/hero.png" width={737} height={678} priority={true} />
</div>
```
- Displays the developer portrait (`/hero.png`) in the bottom-right of the homepage and About page.
- `priority={true}` ensures it loads with high priority (no lazy loading).
- Hidden on mobile; shown only on xl+ screens.

### `Bulb.js` — Glowing Bulb Decoration
```jsx
// Positioned bottom-left, rotated, pulsing
<div className="absolute -left-36 -bottom-12 rotate-12 mix-blend-screen animate-pulse z-10">
  <Image src="/bulb.png" width={260} height={200} />
</div>
```
- **Used on**: Work page (bottom-left corner)
- `mix-blend-screen` blending mode creates a glowing effect on dark backgrounds.
- `animate-pulse` makes it slowly pulse.

### `Circles.js` — Animated Circle Rings
```jsx
// Positioned bottom-right, pulsing
<div className="absolute -right-16 -bottom-2 mix-blend-screen animate-pulse z-10">
  <Image src="/circles.png" width={260} height={200} />
</div>
```
- **Used on**: About, Work, Admin pages (bottom-right corner)
- Same `mix-blend-screen` + `animate-pulse` technique as Bulb.

### `TopLeftImg.js` — Corner Decoration
```jsx
// Top-left corner, semi-transparent, color-shifted
<div className="absolute left-0 top-0 mix-blend-color-dodge z-10 opacity-50 hue-rotate-180">
  <Image src="/top-left-img.png" width={400} height={400} />
</div>
```
- **Used on**: Every page (via `Layout.js`)
- `hue-rotate-180` shifts its color to complement the dark background.
- `mix-blend-color-dodge` lightens the background where it overlaps, creating a subtle glow.

### `ParticlesContainer.js` — Animated Particle Field
Used exclusively on the **home page** as a full-screen animated background layer.

**Configuration highlights:**
```js
particles: {
  color: { value: '#e68e2e' },     // Orange particles
  links: { color: '#f5d393', distance: 150 },  // Connecting lines
  number: { value: 80 },           // 80 particles total
  move: { speed: 1 },              // Slow movement
}
interactivity: {
  onHover: { enable: true, mode: 'repulse', distance: 200 }  // Repel from cursor
}
```
- Particles are orange/gold colored with connecting lines.
- On hover: particles repel from the mouse cursor.
- Positioned absolutely behind all content (`translate-z-0` for GPU layer).

### `ProjectsBtn.js` — Resume Download Button
```jsx
<Link href="/#" onClick={(e) => profileService.downloadResume(e)}>
  <Image src="/roundedText.png" className="animate-spin-slow" />  ← Slow spinning circle text
  <HiArrowDown className="group-hover:translate-y-2" />          ← Hover: arrow drops down
</Link>
```
- **What it does**: Clicking it calls `profileService.downloadResume()` which downloads the resume PDF from the backend.
- The spinning image (`/roundedText.png`) likely says something like "DOWNLOAD RESUME ·" around a circle.
- Background is `bg-circleStar` (the SVG star/circle decoration).

---

## Interactive Shared Components

### `Socials.js` — Social Media Links
Fetches social URLs dynamically from the backend API.

```js
// On mount, fetches from API
const loadSocials = async () => {
  const data = await profileService.getProfile();
  setSocials(data);
};
```

**Rendered icons (only shown if URL exists in API response):**
| Field | Icon |
|---|---|
| `socials.email` | `<RiMailLine />` — mailto: link |
| `socials.linkedinUrl` | `<RiLinkedinLine />` |
| `socials.githubUrl` | `<RiGithubLine />` |
| `socials.youtubeUrl` | `<RiYoutubeLine />` |
| `socials.instagramUrl` | `<RiInstagramLine />` |
| `socials.facebookUrl` | `<RiFacebookLine />` |

- All links open in `_blank` (new tab).
- Icons turn accent color (`hover:text-accent`) on hover.
- **Used in**: `Header.js` (top of every page, hidden on admin routes)

### `ThemeButton.js` — Dark/Light Mode Toggle
```jsx
const { theme, setTheme } = useTheme(); // From next-themes library

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <RiSunLine /> : <RiMoonClearLine />}
</button>
```
- Uses `next-themes` for theme management.
- Delayed render (only after mount) to prevent hydration mismatch.
- **Note**: This component exists but may not be placed in the current Layout — it's a self-contained component ready to use.

### `GlobalLoading.js` — Full-Screen Spinner Overlay

```jsx
// Always in the DOM, shown/hidden via opacity
<div className={`fixed inset-0 z-[100] ${isLoading ? 'visible opacity-100' : 'invisible opacity-0'}`}>
  <div className="bg-[#2e2257] bg-opacity-95 flex items-center justify-center">
    <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
    <div>Loading...</div>
  </div>
</div>
```
- Always rendered in `_app.js`, controlled by the `isLoading` prop.
- Uses **z-[100]** — sits on top of absolutely everything.
- The spinner is the accent teal color (`border-accent`) with a transparent top edge to create the spinning arc effect.
- Smooth opacity transition (fade in/out) instead of mounting/unmounting.

---

## Where Each Component is Used

| Component | Pages/Components |
|---|---|
| `Avatar` | Home (`pages/index.js`), About (`pages/about/index.js`) |
| `Bulb` | Work (`pages/work/index.js`) |
| `Circles` | About, Work, Admin (`pages/adminKottaram/index.js`) |
| `TopLeftImg` | Every page (via `Layout.js`) |
| `ParticlesContainer` | Home only (`pages/index.js`) |
| `ProjectsBtn` | Home only (`pages/index.js`) |
| `Socials` | Every page (via `Header.js`), hidden on admin routes |
| `GlobalLoading` | Every page (via `_app.js`) |
