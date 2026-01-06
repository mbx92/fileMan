# SSO Integration - Implementation Summary

## Overview
Aplikasi FileMan telah diintegrasikan dengan SSO menggunakan OpenID Connect (OIDC) dengan JWT-based authentication.

## Credentials
- **Client ID:** `sso_1b53b15735554950ae8c5f73`
- **Client Secret:** `39fd653df1484b8b8c0409976ba75f299808592beaeb48f2a6e4e19a7b004789`
- **Redirect URI:** `http://localhost:3003/auth/callback` (development)

## Files Created

### 1. Types & Utilities
- **app/types/auth.ts** - Type definitions untuk User, AuthTokens, dan AuthState
- **app/utils/pkce.ts** - PKCE code generation untuk secure OAuth flow
- **app/utils/auth.ts** - Helper functions untuk OIDC flow (buildAuthUrl, exchangeCodeForTokens, fetchUserInfo, refreshAccessToken)

### 2. Composables
- **app/composables/useAuth.ts** - Main composable untuk SSO authentication:
  - `login()` - Redirect ke SSO server
  - `handleCallback()` - Handle OAuth callback
  - `logout()` - Logout dari SSO
  - `refresh()` - Refresh access token
  - `ensureValidToken()` - Auto-refresh jika diperlukan

### 3. Pages
- **app/pages/auth/callback.vue** - OAuth callback handler page
- **app/pages/login.vue** - Updated dengan SSO login button

### 4. Plugins
- **app/plugins/api.ts** - Auto-inject JWT ke API requests
- **app/plugins/auth-init.client.ts** - Restore auth state on app init

## Files Modified

### 1. Configuration
- **.env** - Added SSO configuration variables
- **nuxt.config.ts** - Added SSO runtime config

### 2. Store & Middleware
- **app/stores/auth.ts** - Enhanced dengan SSO token management:
  - Token storage di localStorage
  - Token expiry checking
  - Auto-refresh logic
  - Backward compatibility dengan local auth

- **app/middleware/auth.global.ts** - Updated untuk SSO flow:
  - Auto-restore auth from localStorage
  - Token validation before route access
  - Public routes include `/auth/callback`

## Authentication Flow

### Login Flow
1. User clicks "Sign in with SSO" button
2. App generates PKCE challenge & state
3. Redirects to SSO server (`/api/oidc/authorize`)
4. User authenticates di SSO server
5. SSO redirects back ke `/auth/callback?code=xxx&state=xxx`
6. App exchanges code for tokens
7. App fetches user info
8. Stores user & tokens in localStorage
9. Redirects to dashboard

### Token Management
- **Access Token**: Stored in localStorage, auto-injected ke API calls
- **Refresh Token**: Used untuk mendapatkan new access token
- **Auto-refresh**: Triggered 5 minutes before token expiry
- **Expiry Check**: Dilakukan setiap route navigation

### Logout Flow
1. User clicks logout
2. App clears local storage
3. Redirects to SSO logout endpoint dengan `id_token_hint`
4. SSO clears session
5. Redirects back to app

## Usage

### Development
```bash
# Update .env dengan actual SSO base URL
SSO_BASE_URL="https://your-sso-server.com"

# Run dev server
npm run dev

# Open browser
http://localhost:3003

# Click "Sign in with SSO"
```

### Using the SSO Login
```typescript
// In any component
const { login, logout, user, isAuthenticated } = useAuth()

// Login
await login()

// Logout
await logout()

// Access user data
console.log(user.value)
```

### Using the API Plugin
```typescript
// Auto-includes JWT token
const { $api } = useNuxtApp()

const data = await $api('/files')
// Headers automatically include: Authorization: Bearer <token>
```

## Important Notes

### ⚠️ SSO Base URL Required
Update `.env` dengan actual SSO server URL:
```env
SSO_BASE_URL="https://your-actual-sso-server.com"
```

### ⚠️ Redirect URI Registration
Pastikan redirect URI sudah terdaftar di SSO Admin:
- Development: `http://localhost:3003/auth/callback`
- Production: `https://yourapp.com/auth/callback`

### ⚠️ PKCE Flow
Aplikasi menggunakan PKCE (Proof Key for Code Exchange) untuk enhanced security. Ini adalah best practice untuk SPA applications.

### ⚠️ Token Storage
Tokens disimpan di localStorage untuk persistence. Untuk production, pertimbangkan:
- Use httpOnly cookies untuk refresh token (requires server-side implementation)
- Implement token encryption
- Set proper CORS headers

## Testing Checklist

- [ ] Update SSO_BASE_URL di .env
- [ ] Start dev server
- [ ] Click "Sign in with SSO" di login page
- [ ] Verify redirect ke SSO server
- [ ] Login dengan credentials SSO
- [ ] Verify redirect back ke callback page
- [ ] Check user data di dashboard
- [ ] Verify token di localStorage
- [ ] Test protected routes
- [ ] Test logout flow
- [ ] Test token refresh (wait 5 min before expiry)

## Backward Compatibility

Aplikasi masih mendukung local authentication:
- Email/password login form masih available
- Register form masih berfungsi
- Legacy API endpoints (`/api/auth/login`, `/api/auth/register`) unchanged

## Security Features

✅ PKCE for secure OAuth flow
✅ State parameter validation
✅ Nonce for replay attack prevention
✅ Auto token refresh
✅ Secure token storage
✅ HTTPS required for production
✅ CORS protection

## Next Steps

1. Update `SSO_BASE_URL` dengan actual SSO server URL
2. Test SSO login flow
3. Register production redirect URI di SSO Admin
4. Update production environment variables
5. Deploy to production

## Support

Jika ada masalah:
1. Check browser console untuk errors
2. Verify SSO server URL correct
3. Check SSO Admin Dashboard untuk client configuration
4. Verify redirect URI matches exactly
5. Check network tab untuk API calls

## Reference

Full documentation: `docs/NUXT_4_INTEGRATION.md`
