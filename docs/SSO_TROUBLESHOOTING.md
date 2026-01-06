# SSO Troubleshooting - 401 Error

## Problem
Error 401 saat token exchange dengan SSO server.

## Root Cause
Ada beberapa kemungkinan penyebab error 401:

### 1. Client Secret Tidak Benar
Verifikasi `SSO_CLIENT_SECRET` di `.env` sama dengan yang ada di SSO Admin Dashboard.

### 2. Client ID Tidak Terdaftar
Pastikan `SSO_CLIENT_ID` valid dan terdaftar di SSO server.

### 3. Redirect URI Tidak Match
Redirect URI harus **EXACT MATCH** dengan yang terdaftar di SSO:
- Development: `http://localhost:3003/auth/callback`
- Production: `https://yourdomain.com/auth/callback`
- **NO trailing slash**
- Case-sensitive
- Protocol harus sama (http vs https)

### 4. Authorization Code Sudah Digunakan
Authorization code hanya bisa digunakan sekali. Jika terjadi error dan retry, code sudah invalid.

### 5. Code Expired
Authorization code memiliki lifetime pendek (biasanya 1-5 menit).

### 6. PKCE Verifier Tidak Match
Jika menggunakan PKCE, `code_verifier` harus sama dengan yang digunakan saat generate `code_challenge`.

## Solution Implemented

### Server-Side Token Exchange
Sekarang token exchange dilakukan di server-side untuk keamanan:

**Before (Client-side - NOT SECURE):**
```typescript
// Client mengirim client_secret (INSECURE!)
const response = await $fetch('http://localhost:3000/api/oidc/token', {
  body: {
    client_secret: 'xxx' // ❌ Exposed to browser
  }
})
```

**After (Server-side - SECURE):**
```typescript
// Client calls internal API
const response = await $fetch('/api/auth/sso/callback', {
  method: 'POST',
  body: { code, codeVerifier }
})

// Server handles SSO communication
// client_secret stays on server ✅
```

### New API Endpoints

#### `/api/auth/sso/callback` (POST)
Exchange authorization code for tokens.

**Request:**
```json
{
  "code": "auth_code_from_sso",
  "codeVerifier": "pkce_verifier",
  "redirectUri": "http://localhost:3003/auth/callback"
}
```

**Response:**
```json
{
  "tokens": {
    "access_token": "...",
    "refresh_token": "...",
    "id_token": "...",
    "expires_in": 3600
  },
  "userInfo": {
    "sub": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### `/api/auth/sso/refresh` (POST)
Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "tokens": {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token",
    "expires_in": 3600
  }
}
```

## How to Debug

### 1. Check SSO Server Configuration

Login ke SSO Admin Dashboard dan verify:

```bash
Client ID: sso_1b53b15735554950ae8c5f73
Client Secret: 39fd653df1484b8b8c0409976ba75f299808592beaeb48f2a6e4e19a7b004789
Redirect URIs: 
  - http://localhost:3003/auth/callback (dev)
  - https://yourapp.com/auth/callback (prod)
```

### 2. Check Environment Variables

```bash
# .env
SSO_BASE_URL="http://localhost:3000"  # SSO server URL
SSO_CLIENT_ID="sso_1b53b15735554950ae8c5f73"
SSO_CLIENT_SECRET="39fd653df1484b8b8c0409976ba75f299808592beaeb48f2a6e4e19a7b004789"
SSO_REDIRECT_URI="http://localhost:3003/auth/callback"
```

### 3. Check Browser Console

Open DevTools Console saat login untuk melihat detailed error:

```javascript
// Expected output after fix:
POST /api/auth/sso/callback 200 OK
{
  tokens: {...},
  userInfo: {...}
}
```

### 4. Check Server Logs

Terminal akan menampilkan error jika ada masalah:

```bash
SSO token exchange error: {
  statusCode: 401,
  message: "..."
}
```

### 5. Test SSO Server Directly

Pastikan SSO server bisa diakses:

```bash
# Test dari browser atau curl
curl http://localhost:3000/api/oidc/.well-known/openid-configuration

# Should return SSO configuration
```

## Common Errors & Solutions

### Error: "invalid_client"
**Cause:** Client ID atau Secret salah
**Solution:** 
1. Copy-paste ulang dari SSO Admin
2. Pastikan tidak ada extra spaces
3. Restart dev server setelah update .env

### Error: "invalid_grant"
**Cause:** Authorization code invalid/expired
**Solution:**
1. Don't refresh callback page
2. Start login flow from beginning
3. Check code tidak sudah digunakan

### Error: "redirect_uri_mismatch"
**Cause:** Redirect URI tidak match
**Solution:**
1. Pastikan EXACT match (case-sensitive)
2. No trailing slash
3. Protocol sama (http/https)
4. Port number sama

### Error: "invalid_request"
**Cause:** Missing required parameters
**Solution:**
1. Check PKCE code_verifier ada di sessionStorage
2. Verify semua required fields terisi

## Testing After Fix

### 1. Clear Cache
```bash
# Clear browser cache
Ctrl+Shift+Delete

# Or use incognito mode
Ctrl+Shift+N
```

### 2. Fresh Login Flow
```bash
1. Go to http://localhost:3003
2. Click "Sign in with SSO"
3. Login di SSO server
4. Should redirect to /auth/callback
5. Should see "Login berhasil!"
6. Redirected to /dashboard
```

### 3. Verify Token Storage
```javascript
// Browser DevTools > Console
localStorage.getItem('auth_user')
localStorage.getItem('auth_tokens')

// Should contain user data and tokens
```

## Security Improvements

✅ Client secret tidak exposed ke browser
✅ Token exchange via server-side only
✅ CORS issues resolved
✅ Better error handling
✅ Detailed error logging

## Next Steps

1. ✅ Restart dev server
2. ✅ Clear browser cache/incognito
3. ✅ Test SSO login flow
4. ✅ Check console for errors
5. ✅ Verify tokens stored correctly

## Still Having Issues?

Check:
1. SSO server is running on port 3000
2. FileMan app is running on port 3003
3. No firewall blocking localhost connections
4. `.env` file properly loaded (restart server)
5. Client credentials are correct in SSO Admin
