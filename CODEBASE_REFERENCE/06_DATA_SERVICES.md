# 06 — Data Services: Profile, About, Work, Contact

## Files Covered
- `services/profileService.js`
- `services/aboutService.js`
- `services/workService.js`
- `services/contactService.js`

---

## `services/profileService.js`

Used by: **Home page**, **Socials component**, **ProjectsBtn**

### Methods

#### `getProfile()` → Profile Object
```js
GET /api/v1/profile/getProfile
```
Returns an object containing:
- `name` — Developer name
- `headline` — Job title (e.g., "Senior Full Stack Developer")
- `subHeadline` — Short bio paragraph
- `resumeUrl` — URL to the resume file
- `email`, `linkedinUrl`, `githubUrl`, `youtubeUrl`, `instagramUrl`, `facebookUrl` — Social links

> **Used in two places:**
> - `pages/index.js` — renders name and headline on the hero
> - `components/Socials.js` — renders social media icon links in the header

#### `downloadResume(event)`
```js
GET /api/v1/profile/resume/download
→ responseType: 'blob'  (binary file data)
```
**How it works step-by-step:**
1. Fetches the PDF as binary blob data from backend
2. Creates a browser `Blob` object with MIME type `application/pdf`
3. Generates a temporary object URL (`URL.createObjectURL`)
4. Creates a hidden `<a>` element and clicks it programmatically → triggers download
5. Cleans up: removes the `<a>` from DOM, revokes the object URL

The downloaded file is named `"Ajay_Nair_Resume.pdf"`.

#### `getResumeStats()` → Array
```js
GET /api/v1/profile/resume/stats
```
Returns array of download records (IP + timestamp). Used in the admin dashboard.

---

## `services/aboutService.js`

Used by: **About page** (`pages/about/index.js`)

### Method: `getAbout()` → About Data Object
```js
GET /api/v1/about
```

**Expected response shape:**
```json
{
  "leftSection": {
    "title": "About Me",
    "description": "...",
    "yearsExperience": "2.5+",
    "projectsCompleted": "10+",
    "techDebtReduced": "40%"
  },
  "tabs": [
    {
      "title": "skills",
      "info": [
        {
          "title": "Frontend & UI",
          "icons": [{ "icon": "FaJs", "title": "JavaScript" }, ...]
        }
      ]
    },
    {
      "title": "experience",
      "info": [{ "title": "...", "stage": "2023 - Present", "description": "..." }]
    },
    {
      "title": "awards",
      "info": [{ "title": "...", "stage": "2021", "description": "..." }]
    },
    {
      "title": "certifications",
      "info": [{ "title": "...", "stage": "...", "description": "..." }]
    }
  ]
}
```

> **Icon format from API**: Icon names are strings (e.g., `"FaJs"`, `"SiSpringboot"`). The About page uses an `iconMap` object to convert these strings into actual React icon components.

---

## `services/workService.js`

Used by: **Work page** (`pages/work/index.js`)

### Methods

#### `getWork()` → Work Data Object
```js
GET /api/v1/work
```
**Expected response shape:**
```json
{
  "description": "A curated selection...",
  "projects": [
    {
      "title": "Project Name",
      "thumbnailPath": "/thumb1.jpg",
      "description": "Project description...",
      "techStack": ["SiNextdotjs", "FaJava", "SiSpringboot"],
      "ctaLinks": [
        { "title": "View Code", "url": "https://github.com/..." },
        { "title": "Live Demo", "url": "https://..." }
      ]
    }
  ]
}
```

> **Tech stack from API**: Like about icons, tech stack items are strings (e.g., `"SiNextdotjs"`). `WorkSlider.js` uses `techStackIconMap` to convert these to React icon components.

#### `getProjects()` → Project Array
```js
GET /api/v1/work
→ returns response.data.projects || []
```
A convenience method that returns just the projects array.

---

## `services/contactService.js`

Used by: **Contact page** (`pages/contact/index.js`)

### Method: `sendMessage(contactData)`
```js
POST /api/v1/contact
Body: { name, email, subject, message }
```

**Client-side validation (runs before the API call):**
- `name` is required (non-empty)
- `email` is required (non-empty)
- `message` is required and must be ≥ 10 characters

**What happens on success:**
- Returns a success message from the API
- The contact page resets the form and shows a success banner

---

## Data Flow Diagram for Public Services

```
profileService.getProfile()
    ↓
GET /api/v1/profile/getProfile
    ↓
{ name, headline, subHeadline, resumeUrl, email, linkedinUrl, ... }
    ↓
→ pages/index.js: renders headline + subHeadline
→ components/Socials.js: renders social icon links

aboutService.getAbout()
    ↓
GET /api/v1/about
    ↓
{ leftSection: {...}, tabs: [{skills}, {experience}, {awards}, {certifications}] }
    ↓
→ pages/about/index.js: renders stats + 4-tab info panel

workService.getWork()
    ↓
GET /api/v1/work
    ↓
{ description: "...", projects: [...] }
    ↓
→ pages/work/index.js: passes projects to WorkSlider
→ components/WorkSlider.js: renders project cards in a Swiper slider

contactService.sendMessage(formData)
    ↓
POST /api/v1/contact
    ↓
→ pages/contact/index.js: shows success/error banner
```

---

## Fallback Data Pattern

All pages implement a **fallback data** strategy. If the API fails:
1. A hardcoded object is used instead
2. A yellow warning banner may appear: *"Using cached data"*
3. The page still renders fully — no blank screen

This is critical because the backend is on **Render's free tier**, which sleeps after inactivity (~15-30 second cold start).
