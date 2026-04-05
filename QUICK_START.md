# API Integration Quick Start Checklist

## Pre-Setup
- [ ] Review API_MANIFEST.md to understand available endpoints
- [ ] Ensure your Spring Boot backend is running on Render

## Installation
- [ ] Run: `npm install axios`
- [ ] Verify installation: `npm list axios`

## Service Layer Setup
- [ ] Copy all files from this guide to `/services` directory
  - [ ] apiClient.js
  - [ ] authService.js
  - [ ] profileService.js
  - [ ] aboutService.js
  - [ ] workService.js
  - [ ] contactService.js
  - [ ] adminService.js
  - [ ] index.js
  - [ ] README.md

## Testing (Before Making Changes)
- [ ] Open your app in browser: `npm run dev`
- [ ] Open DevTools → Network tab
- [ ] Visit each page and check for API requests to `portfolio-backend-fsqx.onrender.com`

## Migration - Public Routes (Non-Auth)

### Phase 1: Home Page (Hero/Profile)
- [ ] Read `pages/index.api.js` example
- [ ] Understand changes:
  - Uses `profileService.getProfile()` to fetch hero data
  - Has fallback hardcoded data if API fails
  - Shows loading/error states
- [ ] Tests to perform:
  ```bash
  npm run dev
  # Navigate to home page
  # Check Network tab for GET /api/v1/profile/getProfile
  # Verify data loads or fallback appears
  ```

### Phase 2: About Page
- [ ] Read `pages/about/index.api.js` example
- [ ] Understand changes:
  - Dynamically renders tabs from API
  - Displays skills, experience, awards, certs
  - Uses counters for years/projects/tech debt
- [ ] Test:
  ```bash
  # Navigate to /about
  # Verify all tabs load and render data
  # Check Network tab for GET /api/v1/about
  ```

### Phase 3: Work Page
- [ ] Read `pages/work/index.api.js` example
- [ ] Understand changes:
  - Fetches featured projects from API
  - Passes projects to WorkSlider component
  - Has fallback description if API fails
- [ ] Test:
  ```bash
  # Navigate to /work
  # Verify projects load or sample projects appear
  # Check Network tab for GET /api/v1/work
  ```

### Phase 4: Contact Page
- [ ] Read `pages/contact/index.api.js` example
- [ ] Understand changes:
  - Form state management with useState
  - Validates input before submission
  - Shows success/error messages
  - Submits to API via contactService
- [ ] Test with real submission:
  ```bash
  # Navigate to /contact
  # Fill out form with valid data
  # Submit and check Network tab for POST /api/v1/contact
  # Verify success message appears
  # Test validation: try submitting empty form
  # Verify error message appears
  ```

## File-by-File Migration Instructions

### If migrating from current pages:
1. **Backup** current `pages/index.js`, `pages/about/index.js`, etc.
2. **Copy content** from `.api.js` files into corresponding `pages/` files
3. **Test each page** before moving to the next
4. **Keep fallback data** to prevent UI breaks if API is down

Alternative: Keep `.api.js` files, rename to backup, and switch back if issues:
```bash
# Test the API version first
cp pages/index.api.js pages/index.js
# If issues, revert:
cp pages/index.backup.js pages/index.js
```

## Verification Checklist

### API Connectivity
- [ ] All public pages load without console errors
- [ ] Network tab shows requests to /api/v1/* endpoints
- [ ] Backend responds with 200 OK status
- [ ] Data renders correctly or fallback appears

### Error Handling
- [ ] Close backend and test pages (should show fallback data)
- [ ] Verify no red console errors appear
- [ ] Check error messages are user-friendly

### Form Submission
- [ ] Contact form submits successfully
- [ ] Success message appears on valid submission
- [ ] Error messages appear on validation failure
- [ ] Form clears after successful submission

## Debugging Commands

### Test services in browser console:
```javascript
// Import a service
import { profileService } from './services';

// Test endpoint
await profileService.getProfile();

// Check stored token
localStorage.getItem('jwt_token');

// Test error handling
await profileService.getProfile().catch(err => console.error(err));
```

### Check API request details:
1. Open DevTools → Network tab
2. Filter by XHR or Fetch
3. Look for requests starting with `https://portfolio-backend...`
4. Click request to see:
   - Request headers (Authorization header)
   - Request body
   - Response status and data

## Troubleshooting Steps

### If API requests fail:
1. Verify backend is running on Render (check status page)
2. Check base URL in `services/apiClient.js` is correct
3. Ensure axios is installed: `npm list axios`
4. Check browser console for full error message
5. Look at Network tab → Response to see backend error

### If pages don't update:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Restart dev server: `npm run dev`
4. Check browser console for JavaScript errors

### If authentication fails:
1. Check token is stored: `localStorage.getItem('jwt_token')`
2. Verify token format in localStorage
3. Login fresh to get new token
4. Check token hasn't expired

## Next: Authentication & Admin Pages

Once all public pages work, you can add:
1. Login page (uses `authService.login()`)
2. Protected admin routes
3. Admin dashboard (uses `adminService`)

See `services/adminService.js` for available admin operations.

---

**Estimated Time**: 30-60 minutes for full integration
**Difficulty**: Beginner-Intermediate
**Support**: Check INTEGRATION_GUIDE.md and services/README.md
