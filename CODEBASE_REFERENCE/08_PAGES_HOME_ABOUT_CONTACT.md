# 08 — Pages: Home, About, Contact

## Files Covered
- `pages/index.js` — Home / Landing page
- `pages/about/index.js` — About page
- `pages/contact/index.js` — Contact page

---

## `pages/index.js` — Home Page

### What it renders
The landing/hero page of the portfolio.

### State
```js
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### Data Fetching
```js
useEffect(() => {
  const data = await profileService.getProfile();
  setProfile(data);
}, []);
```
Fetches once on mount. If the API fails, `fallbackProfile` is used (hardcoded name/headline/bio).

### Headline Splitting Logic
```js
const headLinePt1 = displayProfile.headline.split(' ').slice(0, 3).join(' ');
const headLinePt2 = displayProfile.headline.split(' ').slice(3).join(' ');
```
The headline is split into two parts — the first 3 words render in white, the rest in `text-accent` (teal). This creates the colored highlight effect.

Example: `"Senior Full Stack Developer"` → `"Senior Full Stack"` (white) + `"Developer"` (teal)

### Layout Structure
```
<div bg-primary/60>
  <div gradient overlay>
    <div container, text-center on mobile, xl:text-left>
      <motion.h1>   ← Headline (fadeIn down, 0.2s delay)
      <motion.p>    ← Sub-headline/bio (fadeIn down, 0.3s delay)
      {error && <warning banner>}
      <ProjectsBtn> ← Resume download button (different positioning mobile/desktop)
    </div>
  </div>

  <div absolute right-0 bottom-0>          ← Background layer
    <div bg-explosion animate-pulse>        ← Explosion background image
    <ParticlesContainer />                  ← Animated particles
    <motion.div>                            ← Avatar image (fadeIn up, 0.5s)
      <Avatar />
    </motion.div>
  </div>
</div>
```

### Visual Layers (back to front)
1. Background: dark gradient (`bg-primary/60`)
2. Site texture: `bg-explosion` (animated, mix-blend-screen)
3. Particles: `ParticlesContainer` (interactive)
4. Avatar: `hero.png` (bottom-right, desktop only)
5. Text content: Headline, bio, ProjectsBtn
6. Nav + Header: absolute, on top of everything

---

## `pages/about/index.js` — About Page

### State
```js
const [index, setIndex] = useState(0);     // Active tab index (0=skills, 1=exp, 2=awards, 3=certs)
const [aboutData, setAboutData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### Data Fetching
```js
useEffect(() => {
  const data = await aboutService.getAbout();
  setAboutData(data);
}, []);
```
If API fails → uses `fallbackAboutData` (hardcoded).

### Icon Resolution (String → Component)
```js
const iconMap = {
  FaJs: FaJs,
  FaReact: FaReact,
  SiNextdotjs: SiNextdotjs,
  // ... etc
};

// In render:
const IconComponent = iconMap[iconObj.icon]; // "FaJs" → <FaJs />
```
The API returns icon names as strings. This map converts them to actual React icon components.

### The Stats Counters
```jsx
<CountUp start={0} end={yearsExp}  duration={5} decimals={1} />  // "2.5+ Years"
<CountUp start={0} end={projects}  duration={5} />                 // "10+ Projects"
<CountUp start={0} end={techDebt}  duration={5} suffix="%" />      // "40%+ Tech Debt"
```
Numbers animate up from 0 using `react-countup`.

### Tab System
```js
tabs.map((item, itemIndex) => (
  <div
    onClick={() => setIndex(itemIndex)}    // Click tab → update active index
    className={index === itemIndex && 'text-accent after:w-[100%]'}  // Active underline
  >
    {item.title}    // "skills" | "experience" | "awards" | "certifications"
  </div>
))
```

### Content Rendering Logic (Per Tab Item)
Each tab item can have different content types:
- `item.description` → Plain text paragraph
- `item.icons` → Grid of tech icons with labels (skills tab)
- `item.stage` → Date/timeframe shown in accent color

### Layout
```
Left side (flex-1):
  ← h2 heading with accent
  ← Description paragraph
  ← 3 CountUp stat cards (experience, projects, tech debt)

Right side (xl:max-w-[48%]):
  ← Tab buttons: skills | experience | awards | certifications
  ← Scrollable content panel (max-h-[400px] overflow-y-auto)
    ← Tab content changes based on active index
```

---

## `pages/contact/index.js` — Contact Page

### State
```js
const [formData, setFormData] = useState({ name, email, subject, message });
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
const [errorMessage, setErrorMessage] = useState('');
```

### Form Submission Flow
```js
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // 1. Client-side validation
  if (!name || !email || message.length < 10) throw new Error(...);

  // 2. API call
  await contactService.sendMessage(formData);

  // 3. On success: reset form, show green banner
  setFormData({ name:'', email:'', subject:'', message:'' });
  setSubmitStatus('success');

  // 4. Auto-clear success message after 5 seconds
  setTimeout(() => setSubmitStatus(null), 5000);
};
```

### Form Fields
| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | `input[text]` | Yes | Non-empty |
| `email` | `input[email]` | Yes | Non-empty + browser email format |
| `subject` | `input[text]` | No | None |
| `message` | `textarea` | Yes | Min 10 characters |

### Status Banners
- **Success** → Green banner: "✓ Message sent successfully! I'll get back to you soon."
- **Error** → Red banner: "✗ [error message]"

### Submit Button Animation
```jsx
<button type="submit">
  <span className="group-hover:translate-y-[120px] group-hover:opacity-0">
    {isSubmitting ? 'Sending...' : "Let's talk"}   ← Text slides up on hover
  </span>
  <BsArrowRight className="opacity-0 group-hover:opacity-100" />  ← Arrow appears
</button>
```
On hover: the text slides out upward and an arrow icon slides in. A micro-animation.

### `disabled` Behavior
All inputs and the button are `disabled={isSubmitting}` during the API call to prevent double-submission.
