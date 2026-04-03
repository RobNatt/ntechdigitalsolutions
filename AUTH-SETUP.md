# Custom Auth Setup

## Overview

- **Sign in**: ID number + password (no email shown)
- **2FA**: 6-digit code sent via SMS
- **No sign-up**: Profiles created by admin/developer only

## 1. Run Migration

Run `supabase/migrations/002_custom_auth.sql` in Supabase SQL Editor.

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in values. **Do not commit real passwords** to Git; set the account password only in **Supabase → Authentication → Users** (or when creating the user).

```
# Required for auth
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Bootstrap CEO / admin login (optional)
# Login form: Login ID + password. Password is verified by Supabase for AUTH_BOOTSTRAP_EMAIL.
AUTH_BOOTSTRAP_LOGIN_ID=rnattrass
AUTH_BOOTSTRAP_EMAIL=your-account-email@example.com
AUTH_BOOTSTRAP_SKIP_2FA=true

# For production SMS (optional in dev - codes log to console)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Gmail integration (optional - see GMAIL-SETUP.md)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
```

### Bootstrap login (`rnattrass`)

1. In Supabase, create (or use) an Auth user whose **email** matches `AUTH_BOOTSTRAP_EMAIL` and set their **password** there to the password you will use at sign-in.
2. Ensure `public.profiles` has a row with `id` equal to that user’s UUID (the `handle_new_user` trigger usually creates it). Optionally set `login_id = 'rnattrass'` for consistency with other tooling.
3. Set `AUTH_BOOTSTRAP_LOGIN_ID=rnattrass`, `AUTH_BOOTSTRAP_EMAIL` to that user’s email, and `AUTH_BOOTSTRAP_SKIP_2FA=true` in `.env.local` (and in Vercel/hosting env) if you want to skip SMS for this account.
4. At **/login**, use **Login ID** `rnattrass` and your Supabase password.

If `AUTH_BOOTSTRAP_SKIP_2FA` is not `true`, the profile must include `phone_number` for SMS 2FA.

Get the service role key from **Supabase → Settings → API → service_role** (keep secret).

## 3. Set Your Profile

Update your profile with `login_id` and `phone_number` in Supabase SQL Editor:

```sql
UPDATE public.profiles
SET login_id = 'YOUR_ID_NUMBER', phone_number = '+1234567890'
WHERE email = 'robertnattrass92@gmail.com';
```

Use your desired ID (e.g. employee ID) and phone for 2FA.

## 4. Disable Public Sign-Up

In **Supabase → Authentication → Providers → Email**: disable "Confirm email" if desired, and ensure sign-up is disabled or restricted.

## 5. Creating New Users (Admin/Developer Only)

Use Supabase Admin API or Dashboard to create users. Pass metadata when creating:

```json
{
  "email": "user@example.com",
  "password": "secure-password",
  "email_confirm": true,
  "user_metadata": {
    "full_name": "Jane Doe",
    "role": "member",
    "login_id": "EMP001",
    "phone_number": "+15551234567"
  }
}
```

The trigger will create the profile with `login_id` and `phone_number`.

## 6. Sign Out

Call `POST /api/auth/signout` to sign out and clear the 2FA cookie.
