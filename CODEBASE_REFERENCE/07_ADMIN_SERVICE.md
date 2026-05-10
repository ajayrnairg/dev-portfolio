# 07 — Admin Service (Full CRUD Reference)

## File: `services/adminService.js`

All endpoints in `adminService` require a **Bearer JWT token** (attached automatically by `apiClient.js` interceptor). This means the user must be logged in via `authService.login()` before any of these will work.

---

## Section 1: Profile Management

### `updateProfile(profileData)`
```
PUT /api/v1/admin/profile
Body: { name, headline, subHeadline, resumeUrl }
```
Updates the hero section content visible on the homepage.

---

## Section 2: About Section Management

### `updateAboutSection(sectionData)`
```
PUT /api/v1/admin/about/section
Body: { title, description, yearsExperience, projectsCompleted, techDebtReduced }
```
Updates the left panel of the About page (stats and description).

> ⚠️ **Bug Note**: `updateAboutSection` is defined **twice** in the file (lines 39 and 62). JavaScript objects only keep the last definition, so only the second one (`PUT /api/v1/admin/about/section`) is active.

---

## Section 3: Experience Management

### `addExperience(experienceData)`
```
POST /api/v1/admin/experience
Body: { title, stage, description }
```
- `title` — Job title (e.g., "Senior Developer at ACME Corp")
- `stage` — Time period (e.g., "2022 - Present")
- `description` — Role description

### `updateExperience(id, experienceData)`
```
PUT /api/v1/admin/experience/:id
Body: { title, stage, description }
```

---

## Section 4: Project Management

### `addProject(projectData)` / `createProject(projectData)`
```
POST /api/v1/admin/projects
Body: { title, thumbnailPath, description, techStack, ctaLinks }
```
- `techStack` — Array of icon name strings (e.g., `["SiNextdotjs", "FaJava"]`)
- `ctaLinks` — Array of `{ title, url }` objects (e.g., `{ title: "View Code", url: "https://github.com/..." }`)
- `createProject` is an alias that just calls `addProject`.

### `updateProject(projectId, projectData)`
```
PUT /api/v1/admin/projects/:projectId
Body: { title, thumbnailPath, description, techStack, ctaLinks }
```

### `deleteProject(id)`
```
DELETE /api/v1/admin/projects/:id
→ Returns true if status 204 (No Content = success)
```

---

## Section 5: Award Management

### `addAward(awardData)`
```
POST /api/v1/admin/awards
Body: { title, stage, description }
```
- `stage` — Year/date (e.g., "2021")

### `updateAward(id, awardData)`
```
PUT /api/v1/admin/awards/:id
```

### `deleteAward(id)`
```
DELETE /api/v1/admin/awards/:id
→ Returns true if status 204
```

---

## Section 6: Certification Management

### `addCertification(certData)`
```
POST /api/v1/admin/certifications
Body: { title, stage, description }
```

### `updateCertification(id, certData)`
```
PUT /api/v1/admin/certifications/:id
```

### `deleteCertification(id)`
```
DELETE /api/v1/admin/certifications/:id
→ Returns true if status 204
```

---

## Section 7: Skills Management

### `addSkillCategory(categoryData)`
```
POST /api/v1/admin/skill-categories
Body: { name, ... }
```
Skills are organized in categories (e.g., "Frontend", "Backend", "Cloud").

### `updateSkillCategory(id, categoryData)`
```
PUT /api/v1/admin/skill-categories/:id
```

### `deleteSkillCategory(id)`
```
DELETE /api/v1/admin/skill-categories/:id
→ Returns true if status 204
```

### `addSkill(categoryId, skillData)`
```
POST /api/v1/admin/skill-categories/:categoryId/skills
Body: { name, icon, ... }
```
Skills belong to a category and are added under it.

### `updateSkill(id, skillData)`
```
PUT /api/v1/admin/skills/:id
```

### `deleteSkill(id)`
```
DELETE /api/v1/admin/skills/:id
→ Returns true if status 204
```

---

## Section 8: Contact Info & Submissions Management

### `updateContact(contactData)`
```
PATCH /api/v1/admin/profile/contact-info
Body: { email, phone, location, ... }
```
Updates the admin's contact information stored in the backend profile.

### `getContactSubmissions()`
```
GET /api/v1/admin/contact-submissions
→ Returns array of contact form messages received from visitors
```

### `bulkDeleteContactSubmissions(ids)`
```
POST /api/v1/admin/contact-submissions/bulk-delete
Body: [id1, id2, id3, ...]
→ Returns true if status 204
```
Deletes multiple contact submissions at once.

---

## Complete API Endpoint Map

| Method | Endpoint | Service Function |
|---|---|---|
| PUT | `/api/v1/admin/profile` | `updateProfile` |
| PUT | `/api/v1/admin/about/section` | `updateAboutSection` |
| POST | `/api/v1/admin/experience` | `addExperience` |
| PUT | `/api/v1/admin/experience/:id` | `updateExperience` |
| POST | `/api/v1/admin/projects` | `addProject` / `createProject` |
| PUT | `/api/v1/admin/projects/:id` | `updateProject` |
| DELETE | `/api/v1/admin/projects/:id` | `deleteProject` |
| POST | `/api/v1/admin/awards` | `addAward` |
| PUT | `/api/v1/admin/awards/:id` | `updateAward` |
| DELETE | `/api/v1/admin/awards/:id` | `deleteAward` |
| POST | `/api/v1/admin/certifications` | `addCertification` |
| PUT | `/api/v1/admin/certifications/:id` | `updateCertification` |
| DELETE | `/api/v1/admin/certifications/:id` | `deleteCertification` |
| POST | `/api/v1/admin/skill-categories` | `addSkillCategory` |
| PUT | `/api/v1/admin/skill-categories/:id` | `updateSkillCategory` |
| DELETE | `/api/v1/admin/skill-categories/:id` | `deleteSkillCategory` |
| POST | `/api/v1/admin/skill-categories/:id/skills` | `addSkill` |
| PUT | `/api/v1/admin/skills/:id` | `updateSkill` |
| DELETE | `/api/v1/admin/skills/:id` | `deleteSkill` |
| PATCH | `/api/v1/admin/profile/contact-info` | `updateContact` |
| GET | `/api/v1/admin/contact-submissions` | `getContactSubmissions` |
| POST | `/api/v1/admin/contact-submissions/bulk-delete` | `bulkDeleteContactSubmissions` |
