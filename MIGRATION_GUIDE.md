# 🔄 Migration Guide - Better Auth + English Schema

## Summary of Changes

This guide explains the major changes made to AutoRemind PT:

1. **Better Auth** implementation
2. **Database schema** migrated to English
3. Removed old custom auth system
4. Fixed styled-jsx error

---

## 🔐 Authentication Changes

### Before (Custom Auth)
- Simple password-based auth with cookies
- Stored in `.env` as `AUTH_PASSWORD`
- Custom middleware

### After (Better Auth)
- Professional auth with better-auth library
- Email + password authentication
- Proper session management
- Database-backed user system

---

## 🗄️ Database Schema Changes

All database fields are now in **English**:

### Clients Table

| Old (Portuguese) | New (English) | Type |
|------------------|---------------|------|
| nome | name | text |
| telefone | phone | text |
| carro | car | text |
| dataRevisao | revisionDate | timestamp |
| lembreteEnviado | reminderSent | boolean |
| criadoEm | createdAt | timestamp |

### Settings Table

| Old (Portuguese) | New (English) | Type |
|------------------|---------------|------|
| chave | key | text |
| valor | value | text |
| atualizadoEm | updatedAt | timestamp |

### New Tables (Better Auth)

- **user** - User accounts
- **session** - User sessions
- **account** - Auth provider accounts
- **verification** - Email/phone verification tokens

---

## 📦 New Dependencies

```json
{
  "better-auth": "^1.1.4",
  "bcryptjs": "^2.4.3",
  "@types/bcryptjs": "^2.4.6"
}
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Update Environment Variables

Create `.env` from `.env.example`:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-random-secret
```

### 3. Reset Database

**⚠️ WARNING: This will delete all existing data!**

```bash
npm run db:push
```

### 4. Create First User

1. Run the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. You'll be redirected to `/sign-up`
4. Create your account with email + password
5. You'll be logged in automatically

---

## 🔄 API Changes

### Authentication Endpoints

```
POST /api/auth/sign-in
POST /api/auth/sign-up
POST /api/auth/sign-out
GET  /api/auth/get-session
```

### File Structure Changes

#### Removed Files
- `src/lib/auth.ts` (old custom auth)
- `src/app/login/` (old login page)
- `src/components/login-form.tsx` (old)
- `src/components/eliminar-cliente-button.tsx` (renamed)
- `src/components/enviar-lembrete-button.tsx` (renamed)
- `src/components/formulario-cliente.tsx` (renamed)
- `src/components/formulario-config-twilio.tsx` (renamed)

#### New Files
- `src/lib/auth.ts` (better-auth config)
- `src/lib/auth-client.ts` (client-side auth)
- `src/app/api/auth/[...all]/route.ts` (auth API)
- `src/app/sign-in/page.tsx`
- `src/app/sign-up/page.tsx`
- `src/components/auth/sign-in-form.tsx`
- `src/components/auth/sign-up-form.tsx`
- `src/components/delete-client-button.tsx` (renamed)
- `src/components/send-reminder-button.tsx` (renamed)
- `src/components/client-form.tsx` (renamed)
- `src/components/twilio-config-form.tsx` (renamed)

---

## 🔧 Code Changes

### 1. Imports

**Before:**
```typescript
import { clientes, configuracoes } from "@/db/schema";
```

**After:**
```typescript
import { clients, settings } from "@/db/schema";
```

### 2. Field Access

**Before:**
```typescript
cliente.nome
cliente.telefone
cliente.dataRevisao
cliente.lembreteEnviado
```

**After:**
```typescript
client.name
client.phone
client.revisionDate
client.reminderSent
```

### 3. Authentication

**Before:**
```typescript
import { verificarAutenticacao, login, logout } from "@/lib/auth";
```

**After:**
```typescript
// Server-side
import { auth } from "@/lib/auth";
const session = await auth.api.getSession({ headers: await headers() });

// Client-side
import { useSession, signIn, signOut } from "@/lib/auth-client";
```

---

## 🎨 UI Changes

### Login/Sign Up Pages

- No more styled-jsx (fixed the error!)
- Modern gradient backgrounds
- Email + password fields
- Links between sign-in/sign-up
- Better form validation

### Layout

- Shows user name in header
- "Olá, [username]" greeting
- Proper logout button
- Session-aware rendering

---

## 🐛 Fixed Issues

1. ✅ **styled-jsx error** - Removed inline `<style jsx>` tags
2. ✅ **Database fields** - All in English now
3. ✅ **Proper authentication** - Using better-auth
4. ✅ **Session management** - Secure, database-backed

---

## 📝 Migration Checklist

If migrating from the old version:

- [ ] Backup existing database
- [ ] Update environment variables
- [ ] Run `npm install`
- [ ] Run `npm run db:push` to create new tables
- [ ] Create first user account via `/sign-up`
- [ ] Re-add clients through the UI
- [ ] Re-configure Twilio settings
- [ ] Update any custom code using old field names
- [ ] Update cron job URL if needed

---

## 🔮 What's Next?

With better-auth in place, you can now easily add:

- Email verification
- Password reset
- OAuth providers (Google, GitHub, etc.)
- Two-factor authentication
- Session management
- Multiple users/roles

Check the [better-auth docs](https://www.better-auth.com) for more features!

---

## 🆘 Troubleshooting

### "Cannot find module 'better-auth'"

```bash
npm install
```

### "Database error"

Make sure to run:
```bash
npm run db:push
```

### "Session not found"

Clear cookies and sign in again.

### "NEXT_PUBLIC_APP_URL not set"

Add to `.env`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

**Migration completed! 🎉**
