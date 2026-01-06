# SSO Quick Start Guide

## ⚠️ IMPORTANT - Update SSO Base URL

Before running the application, you MUST update the SSO base URL in `.env`:

```env
SSO_BASE_URL="https://your-actual-sso-server.com"
```

Replace `https://sso.yourdomain.com` with your actual SSO server URL.

## How to Test SSO Integration

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test SSO Login Flow

1. Open browser: `http://localhost:3003`
2. Click **"Sign in with SSO"** button on login page
3. You should be redirected to SSO server
4. Login with your SSO credentials
5. You should be redirected back to `/auth/callback`
6. Then redirected to `/dashboard` with user logged in

### 3. Verify Token Storage

Open browser DevTools > Application > Local Storage > `http://localhost:3003`

You should see:
- `auth_user` - User information
- `auth_tokens` - Access token, refresh token, ID token, expiry

### 4. Test Protected Routes

- Try accessing `/dashboard/files` - Should work
- Try accessing `/dashboard/shared` - Should work
- Logout and try accessing `/dashboard` - Should redirect to login

### 5. Test Logout

1. Click logout button
2. Should redirect to SSO logout
3. Then redirect back to login page
4. Check localStorage is cleared

## Troubleshooting

### SSO Redirect Not Working

**Issue:** Clicking "Sign in with SSO" doesn't redirect

**Solutions:**
- Check browser console for errors
- Verify `SSO_BASE_URL` in `.env` is correct
- Check Network tab for failed requests
- Verify SSO server is accessible

### Invalid Redirect URI

**Issue:** SSO returns error about redirect URI

**Solutions:**
- Verify redirect URI in SSO Admin Dashboard matches exactly:
  - Development: `http://localhost:3003/auth/callback`
  - Production: `https://yourapp.com/auth/callback`
- No trailing slashes
- Protocol must match (http vs https)

### Invalid State Parameter

**Issue:** Error on callback page about invalid state

**Solutions:**
- Clear browser cache and cookies
- Try in incognito/private window
- Check sessionStorage is not blocked

### Token Expired Loop

**Issue:** User keeps getting logged out

**Solutions:**
- Check token expiry is set correctly
- Verify refresh token flow is working
- Check browser console for refresh errors

## SSO Configuration Checklist

In SSO Admin Dashboard, verify:

- [ ] Client ID: `sso_1b53b15735554950ae8c5f73`
- [ ] Client Secret: `39fd653df1484b8b8c0409976ba75f299808592beaeb48f2a6e4e19a7b004789`
- [ ] Redirect URIs include: `http://localhost:3003/auth/callback`
- [ ] Grant Types: `authorization_code`, `refresh_token`
- [ ] Scopes: `openid`, `profile`, `email`
- [ ] PKCE Required: ✅ Enabled

## API Usage with SSO Tokens

All API requests will automatically include the JWT token:

```typescript
// In any component
const { $api } = useNuxtApp()

// Token is automatically injected
const files = await $api('/files')
const user = await $api('/auth/me')
```

## Logout Users from SSO

```typescript
const { logout } = useAuth()

// Logs out from both app and SSO server
await logout()
```

## Check Authentication Status

```typescript
const { user, isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  console.log('User:', user.value)
}
```

## Next Steps

1. ✅ Update `SSO_BASE_URL` in `.env`
2. ✅ Test SSO login flow
3. ✅ Register production redirect URI in SSO Admin
4. ✅ Update `.env` for production deployment
5. ✅ Test all authentication flows
6. ✅ Deploy to production

## Support

For issues, check:
1. Browser console errors
2. Network tab for API calls
3. SSO Admin Dashboard audit logs
4. Application logs

Full documentation: `docs/NUXT_4_INTEGRATION.md`
Implementation details: `docs/SSO_IMPLEMENTATION.md`
