# SSO Role Integration

## Overview
FileMan secara otomatis mensinkronisasi roles dari SSO server ke database lokal saat user login. Ini memungkinkan kontrol akses berbasis role yang konsisten dengan sistem SSO Anda.

## Cara Kerja

### 1. Login Flow dengan Role Sync
```
User Login → SSO Authentication → Token Exchange → Get UserInfo → Sync to Database
                                                         ↓
                                                   Role Mapping
                                                         ↓
                                                 Save to Database
```

### 2. Role Mapping
SSO roles dipetakan ke FileMan roles sebagai berikut:

| SSO Role                | FileMan Role | Deskripsi                |
|-------------------------|--------------|--------------------------|
| `superadmin`, `super_admin` | `SUPERADMIN` | Full system access      |
| `admin`, `administrator`    | `ADMIN`      | Administrative access   |
| `user`, default             | `USER`       | Standard user access    |

### 3. SSO UserInfo Fields
FileMan akan membaca role dari SSO dengan prioritas:

1. **Primary**: `userInfo.role` - field utama untuk role
2. **Fallback**: `userInfo.role_name` - alternatif jika `role` tidak ada
3. **Default**: Jika kedua field tidak ada, user akan mendapat role `USER`

## Implementasi

### Server-Side: Sync User Endpoint
File: `server/api/auth/sso/sync-user.post.ts`

```typescript
// Upsert user with SSO role mapping
const user = await prisma.user.upsert({
  where: { ssoId: userInfo.sub },
  update: {
    email: userInfo.email,
    username: userInfo.preferred_username,
    name: userInfo.name,
    role: mappedRole, // ← Role dari SSO di-mapping ke enum
  },
  create: {
    ssoId: userInfo.sub,
    email: userInfo.email,
    role: mappedRole,
    ssoProvider: 'oidc',
  }
})
```

### Client-Side: Login Callback
File: `app/composables/useAuth.ts`

```typescript
// Setelah token exchange, sync user ke database
const syncResponse = await $fetch('/api/auth/sso/sync-user', {
  method: 'POST',
  body: { userInfo },
})

// Gunakan role dari database (sudah di-mapping)
const user = {
  ...syncResponse.user,
  role: syncResponse.user.role // ← SUPERADMIN/ADMIN/USER
}
```

## Konfigurasi SSO Server

### Pastikan SSO Server Mengirim Role
Pada SSO OIDC userinfo endpoint, pastikan response menyertakan field `role`:

```json
{
  "sub": "user-123",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",           ← Field penting untuk role mapping
  "role_name": "Administrator"  ← Field alternatif
}
```

### Format Role yang Didukung
- **Case-insensitive**: `Admin`, `admin`, `ADMIN` → semua valid
- **Underscore**: `super_admin` atau `superadmin` → keduanya valid
- **Variants**:
  - Superadmin: `superadmin`, `super_admin`
  - Admin: `admin`, `administrator`
  - User: `user` atau tidak ada (default)

## Testing

### 1. Cek Role di Settings
1. Login ke FileMan
2. Buka **Settings → SSO Roles**
3. Lihat tabel mapping roles

### 2. Verifikasi Database
```sql
SELECT username, email, role, "ssoProvider", "ssoId" 
FROM "User" 
WHERE "ssoProvider" = 'oidc';
```

### 3. Test Different Roles
Login dengan user berbeda dari SSO yang memiliki roles berbeda:
- User dengan role `admin` → harus dapat `ADMIN`
- User dengan role `superadmin` → harus dapat `SUPERADMIN`
- User tanpa role → harus dapat `USER`

## Troubleshooting

### Role Tidak Terdeteksi
**Problem**: User selalu mendapat role `USER`

**Solution**:
1. Cek response dari SSO userinfo endpoint
2. Pastikan field `role` atau `role_name` ada
3. Lihat server logs untuk mapping yang terjadi
4. Update SSO claims untuk include role

### Role Tidak Update Setelah Berubah di SSO
**Problem**: User sudah promosi ke admin di SSO, tapi masih `USER` di FileMan

**Solution**:
Role di-sync setiap login. User harus:
1. Logout dari FileMan
2. Login ulang
3. Role akan di-update otomatis

Atau admin dapat update manual di database:
```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'user@example.com';
```

## Permission Check

### Di Frontend
```typescript
const authStore = useAuthStore()

// Check role
if (authStore.isAdmin) {
  // Show admin features
}

if (authStore.isSuperAdmin) {
  // Show superadmin features
}
```

### Di Backend Middleware
```typescript
export default defineEventHandler((event) => {
  const user = event.context.user
  
  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Admin access required'
    })
  }
})
```

## Best Practices

1. **Gunakan Role dari Database**: Jangan gunakan role dari localStorage saja, selalu sync ke database
2. **Validate di Backend**: Permission check harus ada di server-side
3. **Update Role Format**: Standarisasi format role di SSO server (gunakan lowercase)
4. **Audit Log**: Track role changes untuk security audit
5. **Default to Least Privilege**: Default role adalah `USER`, bukan admin

## Security Notes

⚠️ **Important**:
- Role mapping hanya terjadi saat login
- Client tidak bisa mengubah role (enforced di database)
- Backend middleware selalu validate dari database
- SSO server adalah source of truth untuk roles

## Related Files

- `server/api/auth/sso/sync-user.post.ts` - Role sync endpoint
- `app/composables/useAuth.ts` - Login flow dengan sync
- `prisma/schema.prisma` - User model dengan Role enum
- `server/middleware/auth.ts` - Auth middleware
- `app/pages/dashboard/settings.vue` - Role mapping documentation UI
