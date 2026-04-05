# Service Layer Setup Guide

## 1. Install Axios

The service layer requires `axios` for HTTP requests. Add it to your project:

```bash
npm install axios
```

or with yarn:

```bash
yarn add axios
```

## 2. Project Structure

All service files are located in the `services/` directory:

```
services/
├── apiClient.js        # Axios instance with interceptors
├── authService.js      # Authentication endpoints
├── profileService.js   # Profile/Hero section endpoints
├── aboutService.js     # About section endpoints
├── workService.js      # Work/Projects endpoints
├── contactService.js   # Contact form endpoint
├── adminService.js     # Admin-protected endpoints
└── index.js            # Central exports
```

## 3. Usage Examples

### Import services individually:
```javascript
import profileService from '../services/profileService';
import workService from '../services/workService';
```

### Or import from index:
```javascript
import { profileService, workService, authService } from '../services';
```

### Fetch Profile Data in a React Component:
```javascript
import { useEffect, useState } from 'react';
import profileService from '../services/profileService';

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>{profile?.headline}</p>
    </div>
  );
}
```

## 4. Error Handling

### 401/403 Unauthorized
- Automatically redirects to `/login` page
- Removes JWT token from localStorage
- Triggered by `apiClient` interceptors

### 503 Service Unavailable (Render Sleep)
- Logs error message to console
- User should retry after waiting

### Request Errors
All service methods return promises and throw errors that can be caught:

```javascript
try {
  const data = await profileService.getProfile();
} catch (error) {
  console.error('Failed to fetch profile:', error.response?.data || error.message);
}
```

## 5. JWT Token Management

### Automatic Token Attachment
- Token is automatically attached to all requests if it exists in localStorage
- No manual header configuration needed

### Login and Token Storage
```javascript
import authService from '../services/authService';

// Login automatically stores token
await authService.login('user@example.com', 'password');

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}

// Logout removes token
authService.logout();
```

## 6. API Base URL

All requests are made to:
```
https://portfolio-backend-fsqx.onrender.com
```

This is configured in `apiClient.js` and can be updated in one place if needed.

## 7. Services Available

### Auth Service (`authService`)
- `login(email, password)` - Login and get JWT
- `logout()` - Remove JWT token
- `isAuthenticated()` - Check if user is logged in
- `getToken()` - Get stored JWT token

### Profile Service (`profileService`)
- `getProfile()` - Get hero section data
- `downloadResume()` - Download resume (tracked)
- `getResumeStats()` - Get download statistics

### About Service (`aboutService`)
- `getAbout()` - Get about section with all tabs (skills, experience, awards, certifications)

### Work Service (`workService`)
- `getWork()` - Get featured projects

### Contact Service (`contactService`)
- `sendMessage(contactData)` - Send contact form message

### Admin Service (`adminService`) - *Requires Authentication*
- `updateProfile(profileData)` - Update profile
- `updateAboutSection(aboutData)` - Update about section
- `addExperience(experienceData)` - Add experience entry
- `deleteExperience(id)` - Delete experience entry
- `addProject(projectData)` - Add project
- `deleteProject(id)` - Delete project
- `addAward(awardData)` - Add award
- `deleteAward(id)` - Delete award
- `addCertification(certData)` - Add certification
- `deleteCertification(id)` - Delete certification

## 8. Next Steps

1. Install axios: `npm install axios`
2. Update your components to use the service layer (see examples below)
3. Test API connections in development
4. Migrate from hardcoded data to API responses
