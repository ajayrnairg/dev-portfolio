# 05 — Services Layer: API Client, Auth & Loading

## Files Covered
- `services/apiClient.js` — Axios HTTP client foundation
- `services/loadingService.js` — Global loading state manager
- `services/authService.js` — JWT authentication
- `services/index.js` — Central export barrel

---

## Architecture Overview

```
services/
├── index.js           ← Single import point for all services
├── apiClient.js       ← Axios instance (base URL, interceptors)
├── loadingService.js  ← Observer pattern: tracks active requests
├── authService.js     ← JWT login/logout/check
├── profileService.js  ← Profile & resume data
├── aboutService.js    ← About section data
├── workService.js     ← Projects data
├── contactService.js  ← Contact form submission
└── adminService.js    ← All protected admin CRUD operations
```

---

## `services/apiClient.js` — The HTTP Foundation

Every single API call in this project goes through this one Axios instance.

### Base URL
```js
const BASE_URL = 'https://portfolio-backend-fsqx.onrender.com';
// const BASE_URL = 'http://localhost:8080';   ← Toggle for local dev
```
The local dev URL is commented out. To run locally, uncomment and comment the production URL.

### Axios Instance Config
```js
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,      // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor — Runs before EVERY request
```js
apiClient.interceptors.request.use((config) => {
  loadingService.increment();     // ← Shows global spinner

  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;   // ← Attaches JWT
  }
  return config;
});
```
**Two things happen before every request:**
1. Loading counter increments → spinner appears globally
2. If a JWT token exists in localStorage, it's attached as a Bearer token

### Response Interceptor — Runs after EVERY response
```js
apiClient.interceptors.response.use(
  (response) => {
    loadingService.decrement();   // ← Hides spinner
    return response;
  },
  (error) => {
    loadingService.decrement();   // ← Always hide spinner on error too

    if (status === 401 || status === 403) {
      localStorage.removeItem('jwt_token');   // ← Clear bad token
      window.location.href = '/login';        // ← Force re-login
    }

    if (status === 503) {
      // Render free tier "wake up" message
      console.error('Backend service is sleeping...');
    }
  }
);
```

---

## `services/loadingService.js` — Observer Pattern Loading Manager

This is a **custom pub/sub (observer) system** — not React state, not Redux — it's a plain JS singleton.

```js
const listeners = new Set();
let activeRequestCount = 0;
```

### How it works
```
apiClient makes request → loadingService.increment()
  → activeRequestCount = 1
  → notifyListeners(true)   → _app.js shows spinner

apiClient gets response → loadingService.decrement()
  → activeRequestCount = 0
  → notifyListeners(false)  → _app.js hides spinner
```

### API
| Method | What it does |
|---|---|
| `subscribe(listener)` | Registers a callback, returns unsubscribe function |
| `increment()` | Adds 1 to active request count, notifies all listeners |
| `decrement()` | Subtracts 1 (min 0), notifies all listeners |
| `getIsLoading()` | Returns true/false synchronously |

### Usage in `_app.js`
```js
useEffect(() => {
  // Register _app.js as a listener
  const unsubscribe = loadingService.subscribe(setIsApiLoading);
  return unsubscribe;  // Cleanup on unmount
}, []);
```

**Why this pattern?** It decouples the loading state from React component hierarchy. Any service can trigger a spinner without prop-drilling or a global store.

---

## `services/authService.js` — JWT Authentication

Manages user authentication for the admin panel.

### Methods

#### `login(email, password)`
```js
login: async (email, password) => {
  const response = await apiClient.post('/api/v1/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('jwt_token', response.data.token);  // Persist JWT
  }
  return response.data;
}
```
- Calls `POST /api/v1/auth/login`
- Stores returned JWT token in `localStorage` as `jwt_token`

#### `logout()`
```js
logout: () => {
  localStorage.removeItem('jwt_token');
}
```
Simply deletes the token. No backend call needed.

#### `isAuthenticated()` → boolean
```js
isAuthenticated: () => {
  return !!localStorage.getItem('jwt_token');
}
```
Returns `true` if a token exists. **Note**: Does NOT validate token expiry — just checks presence.

#### `getToken()` → string | null
Returns the raw JWT string from localStorage.

---

## `services/index.js` — The Barrel Export

This is a convenience file so you never have to import from individual service files directly.

```js
// Instead of: import profileService from '../services/profileService';
// You write:   import { profileService } from '../services';

export { default as apiClient }      from './apiClient';
export { default as authService }    from './authService';
export { default as profileService } from './profileService';
export { default as aboutService }   from './aboutService';
export { default as workService }    from './workService';
export { default as contactService } from './contactService';
export { default as adminService }   from './adminService';
```

---

## Request Flow Summary

```
Component calls service method
    ↓
Service calls apiClient.get/post/put/delete(endpoint)
    ↓
Request Interceptor:
  - loadingService.increment() → GlobalLoading spinner appears
  - JWT token attached if exists
    ↓
Backend API (Render)
    ↓
Response Interceptor:
  - loadingService.decrement() → Spinner hides
  - 401/403: clear token + redirect to /login
  - 503: log backend sleeping message
    ↓
Service receives response.data
    ↓
Component updates state
```
