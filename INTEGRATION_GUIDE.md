# API Integration Implementation Guide

## Overview
This guide walks you through integrating the Service Layer (API client) with your React portfolio application. All public routes have been updated to fetch data from your Spring Boot backend on Render.

## Files Included

### Service Files (in `/services` directory)
- **apiClient.js** - Axios instance with automatic JWT token attachment and error handling
- **authService.js** - Authentication endpoints
- **profileService.js** - Profile/Hero section endpoints  
- **aboutService.js** - About section endpoints
- **workService.js** - Work/Projects endpoints
- **contactService.js** - Contact form endpoint
- **adminService.js** - Protected admin endpoints (for future use)
- **index.js** - Central export file
- **README.md** - Service layer documentation

### Updated Page Examples (in `/pages` directory)
- **pages/index.api.js** - Updated Home/Hero page with API integration
- **pages/about/index.api.js** - Updated About page with dynamic API data
- **pages/work/index.api.js** - Updated Work page with dynamic projects
- **pages/contact/index.api.js** - Updated Contact page with form submission

## Step-by-Step Migration

### Step 1: Install Axios
```bash
npm install axios
```

### Step 2: Review the Service Layer
- Check `services/README.md` to understand the available services
- Review `services/apiClient.js` to see how interceptors work
- Look at individual service files to understand method signatures

### Step 3: Update Pages Incrementally

#### Option A: Quick Migration (Use `.api.js` Files)
For quick testing, the `.api.js` files are ready to use:

1. **Test the Home Page** (lowest risk):
   ```javascript
   // pages/index.js - Replace with content from pages/index.api.js
   ```
   This page fetches hero section data and has fallback values.

2. **Test the Work Page**:
   ```javascript
   // pages/work/index.js - Replace with content from pages/work/index.api.js
   ```
   This page fetches featured projects from the API.

3. **Test the About Page**:
   ```javascript
   // pages/about/index.js - Replace with content from pages/about/index.api.js
   ```
   This page dynamically renders skills, experience, awards, certifications.

4. **Test the Contact Page**:
   ```javascript
   // pages/contact/index.js - Replace with content from pages/contact/index.api.js
   ```
   This page submits contact forms to your backend.

#### Option B: Manual Integration
If you prefer to keep your existing component structure, integrate gradually:

```javascript
import { useEffect, useState } from 'react';
import { profileService } from '../services';

// In your component:
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await profileService.getProfile();
      // Use data in your component
    } catch (error) {
      console.error('Failed to fetch:', error);
      // Use fallback data
    }
  };
  
  fetchData();
}, []);
```

### Step 4: Test API Connections

#### Test in Browser Console
```javascript
// Test profile endpoint
import { profileService } from './services';
profileService.getProfile().then(data => console.log(data));

// Test work endpoint  
import { workService } from './services';
workService.getWork().then(data => console.log(data));

// Test about endpoint
import { aboutService } from './services';
aboutService.getAbout().then(data => console.log(data));
```

#### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to your pages
4. Look for requests to `https://portfolio-backend-fsqx.onrender.com/api/v1/*`

### Step 5: Handle Errors

The service layer includes automatic error handling for:
- **401/403 errors** - Redirects to login page and clears token
- **503 errors** - Logs Render service unavailable message
- **Network errors** - Logs to console for debugging

All pages have fallback hardcoded data, so the app never breaks completely.

## Key Features

### Automatic JWT Token Management
```javascript
// No manual header configuration needed!
// Token is automatically attached to requests if it exists

// Login stores token
await authService.login('user@email.com', 'password');

// Token is automatically used for all subsequent requests
await adminService.updateProfile(profileData);

// Logout clears token
authService.logout();
```

### Error Handling
```javascript
try {
  const data = await profileService.getProfile();
} catch (error) {
  if (error.response?.status === 401) {
    // User not authenticated
  } else if (error.response?.status === 503) {
    // Backend service sleeping
  } else {
    // Other error
  }
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  profileService.getProfile()
    .then(data => {
      setProfile(data);
    })
    .finally(() => setLoading(false));
}, []);

if (loading) return <Spinner />;
return <YourComponent data={profile} />;
```

## API Endpoints Reference

### Public Endpoints (No Auth Required)

| Service | Method | Endpoint | Returns |
|---------|--------|----------|---------|
| `profileService.getProfile()` | GET | `/api/v1/profile/getProfile` | Hero section data |
| `profileService.downloadResume()` | GET | `/api/v1/profile/resume/download` | Redirect to resume |
| `profileService.getResumeStats()` | GET | `/api/v1/profile/resume/stats` | Download statistics |
| `aboutService.getAbout()` | GET | `/api/v1/about` | Skills, experience, awards, certs |
| `workService.getWork()` | GET | `/api/v1/work` | Featured projects |
| `contactService.sendMessage(data)` | POST | `/api/v1/contact` | Sends contact form |
| `authService.login(email, pass)` | POST | `/api/v1/auth/login` | JWT token |

### Protected Endpoints (Auth Required)
See `services/adminService.js` for full list. All require Bearer token from login.

## Troubleshooting

### Issue: "Cannot find module 'axios'"
**Solution**: Run `npm install axios`

### Issue: API returns 503 (Service Sleeping)
**Solution**: Render free tier sleeps after inactivity. Wait 1-2 minutes and retry.

### Issue: 401/403 Unauthorized
**Solution**: Token may have expired. Clear localStorage and login again:
```javascript
localStorage.removeItem('jwt_token');
// Navigate to login page
```

### Issue: Pages blank with errors
**Solution**: Check browser console for errors. Ensure:
1. Axios is installed
2. Base URL is correct in apiClient.js
3. Backend is running and accessible

### Issue: CORS Errors
**Solution**: Your backend should have CORS enabled. If not, contact backend maintainer.

## Next Steps

1. **Install axios**: `npm install axios`
2. **Copy service files** into your project's `/services` directory
3. **Update one page at a time** (start with Home/Hero)
4. **Test API connections** in browser DevTools
5. **Deploy to production** once tested

## Support

Refer to:
- `services/README.md` - Service method documentation
- `API_MANIFEST.md` - Complete API endpoint reference
- Updated page files (`*.api.js`) - Working examples

---

**Last Updated**: April 2026
**Backend URL**: `https://portfolio-backend-fsqx.onrender.com`
**API Version**: v1
