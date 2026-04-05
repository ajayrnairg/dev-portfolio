# Service Layer Architecture

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         REACT APPLICATION                        │
│                                                                  │
│  Pages:                   Components:                           │
│  - Home (Hero)           - Avatar                              │
│  - About                 - WorkSlider                          │
│  - Work (Projects)       - Circles                             │
│  - Contact               - etc.                                │
│                                                                  │
│  All pages consume services for data                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │ useEffect(() => {
                              │   serviceMethod()
                              │ })
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
│                    (services/ directory)                         │
│                                                                  │
│  Main Coordinator:              Data Services:                  │
│  ┌──────────────────────┐       ┌──────────────────────┐       │
│  │   apiClient.js       │       │ profileService.js    │       │
│  │ ────────────────────│       │ ────────────────────│       │
│  │ - Base URL config    │       │ - getProfile()      │       │
│  │ - Request interceptor│       │ - downloadResume()  │       │
│  │   (JWT attachment)  │       │ - getResumeStats()  │       │
│  │ - Response interceptor       └──────────────────────┘       │
│  │   (error handling)  │                                        │
│  └──────────────────────┘       ┌──────────────────────┐       │
│                                 │ aboutService.js      │       │
│  Authentication:                │ ────────────────────│       │
│  ┌──────────────────────┐       │ - getAbout()        │       │
│  │ authService.js       │       └──────────────────────┘       │
│  │ ────────────────────│                                        │
│  │ - login()          │        ┌──────────────────────┐       │
│  │ - logout()         │        │ workService.js       │       │
│  │ - isAuthenticated()│        │ ────────────────────│       │
│  │ - getToken()       │        │ - getWork()          │       │
│  └──────────────────────┘       └──────────────────────┘       │
│                                                                  │
│  Forms:                         ┌──────────────────────┐       │
│  ┌──────────────────────┐       │ contactService.js    │       │
│  │ adminService.js      │       │ ────────────────────│       │
│  │ ────────────────────│       │ - sendMessage()     │       │
│  │ - updateProfile()   │       └──────────────────────┘       │
│  │ - updateAbout()     │                                        │
│  │ - addExperience()   │        index.js (Central Export)      │
│  │ - deleteExperience()│        ────────────────────────────    │
│  │ - addProject()      │        export all services at once    │
│  │ - deleteProject()   │                                        │
│  │ - addAward()        │                                        │
│  │ - addCertification()│                                        │
│  │ - etc.              │                                        │
│  └──────────────────────┘                                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │ axios.get/post/put/delete()
                              │ + Authorization header (if token)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HTTP REQUESTS                               │
│                                                                  │
│  Base URL: https://portfolio-backend-fsqx.onrender.com         │
│  Timeout: 10 seconds                                            │
│  Headers: Content-Type: application/json                        │
│           Authorization: Bearer {jwt_token} (if exists)        │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SPRING BOOT BACKEND                            │
│              (Render: portfolio-backend-fsqx)                    │
│                                                                  │
│  Controllers (matching API Manifest):                           │
│  ─────────────────────────────────────                          │
│  POST   /api/v1/auth/login                                     │
│  GET    /api/v1/profile/getProfile                            │
│  GET    /api/v1/profile/resume/download                       │
│  GET    /api/v1/profile/resume/stats                          │
│  GET    /api/v1/about                                          │
│  GET    /api/v1/work                                           │
│  POST   /api/v1/contact                                        │
│  PUT    /api/v1/admin/profile          (requires token)       │
│  PUT    /api/v1/admin/about/section    (requires token)       │
│  POST   /api/v1/admin/experience       (requires token)       │
│  POST   /api/v1/admin/projects         (requires token)       │
│  etc.                                                           │
│                                                                  │
│  Database: Stores portfolio data                                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: Loading Hero Section
```
User navigates to Home
        │
        ▼
pages/index.js (useEffect)
        │
        ├─► profileService.getProfile()
        │
        ├─► apiClient.get('/api/v1/profile/getProfile')
        │   ├─ Checks localStorage for JWT token
        │   ├─ Attaches Authorization header if token exists
        │   ├─ Sends GET request to Render backend
        │
        ├─► Backend responds with hero data
        │   {
        │     name: "John Doe",
        │     headline: "Senior Developer",
        │     subHeadline: "...",
        │     resumeUrl: "..."
        │   }
        │
        ├─► Component state updated with data
        │   setProfile(data)
        │
        ▼
Page renders with API data
(or fallback if error)
```

### Example 2: Submitting Contact Form
```
User fills form and clicks "Send"
        │
        ▼
pages/contact/index.js (handleSubmit)
        │
        ├─► Validates input
        │   (name, email, message required)
        │
        ├─► contactService.sendMessage(formData)
        │
        ├─► apiClient.post('/api/v1/contact', {
        │     name: "Jane",
        │     email: "jane@example.com",
        │     subject: "Inquiry",
        │     message: "..." (min 10 chars)
        │   })
        │
        ├─► Backend processes and stores message
        │
        ├─► Backend responds with:
        │   { message: "Talk to you soon, Jane!" }
        │
        ├─► Component shows success message
        │
        ├─► Form clears and resets
        │
        ▼
User sees success notification
```

### Example 3: Authentication Flow (Logout on 401)
```
User makes authenticated request
(e.g., admin dashboard)
        │
        ▼
adminService.updateProfile(data)
        │
        ├─► apiClient.put('/api/v1/admin/profile', data)
        │   ├─ Retrieves token from localStorage
        │   ├─ Attaches: Authorization: Bearer {token}
        │   ├─ Sends PUT request
        │
        ├─► Response Interceptor
        │   │
        │   ├─ If status 401 or 403:
        │   │  ├─ localStorage.removeItem('jwt_token')
        │   │  ├─ window.location.href = '/login'
        │   │  
        │   └─ If status 503:
        │      └─ Log: "Backend service is sleeping"
        │
        ▼
User redirected to login page
(or sees error notification)
```

## Error Handling Flow

```
Request to API
        │
        ▼
Response Interceptor catches error
        │
        ├─ Is there a response?
        │  │
        │  └─ YES: Check status code
        │     │
        │     ├─ 401/403 Unauthorized?
        │     │  └─► Clear token & redirect to /login
        │     │
        │     ├─ 503 Service Unavailable?
        │     │  └─► Log "Backend service sleeping"
        │     │
        │     └─ Other error?
        │        └─► Log error details to console
        │
        └─ NO response received?
           └─► Log "No response received"
                (likely network error)
        │
        ▼
Error rejected from promise
        │
        ▼
Component catches error
        │
        ├─► Log error message
        ├─► Set error state
        └─► Show fallback data OR error UI

User sees fallback data or error message
```

## Request/Response Headers

### Request to Backend
```
GET https://portfolio-backend-fsqx.onrender.com/api/v1/profile/getProfile
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (if logged in)
```

### Response from Backend
```
Status: 200 OK
Headers:
  Content-Type: application/json

Body:
{
  "name": "John Doe",
  "headline": "Senior Full Stack Developer",
  "subHeadline": "Passionate developer...",
  "resumeUrl": "https://cloudinary.com/..."
}
```

## Token Storage & Lifecycle

```
1. User logs in
   ▼
authService.login(email, password)
   ▼
API returns: { token: "jwt_token_string" }
   ▼
localStorage.setItem('jwt_token', token)
   │
   └─► Token now in browser storage
        (persists across page reloads)

2. User makes authenticated request
   ▼
Request interceptor checks:
localStorage.getItem('jwt_token')
   ▼
Token found? YES
   ▼
Attach to request header:
Authorization: Bearer {token}
   └─► Sent to backend

3. User logs out OR token expires
   ▼
authService.logout()
   OR
Response interceptor detects 401
   ▼
localStorage.removeItem('jwt_token')
   │
   └─► Token removed from storage
        No more authenticated requests
```

## Performance Considerations

### Caching
- Responses are NOT cached by default
- Each component fetch triggers new API request
- Add client-side caching if needed:
  ```javascript
  const [cached, setCached] = useState({});
  
  useEffect(() => {
    if (cached.profile) {
      setProfile(cached.profile);
      return;
    }
    // Fetch from API
  }, []);
  ```

### Loading States
- All pages include loading states
- Fallback data shown if API fails
- Users never see blank pages

### Timeout
- 10 second timeout on all requests
- Render free tier may be slow initially
- Consider increasing timeout if needed

---

This architecture ensures:
✅ Clean separation of concerns
✅ Reusable service layer
✅ Automatic error handling
✅ JWT token management
✅ Fallback data when API fails
✅ Type-safe requests (with JSDoc comments)
