# Custom Auth Setup

## Overview

- **Sign in**: ID number + password (no email shown)
- **2FA**: 6-digit code sent via SMS
- **No sign-up**: Profiles created by admin/developer only

## Troubleshooting (“it used to work”)

1. **Two ways to sign in**
   - **Bootstrap**: `AUTH_BOOTSTRAP_LOGIN_ID` + `AUTH_BOOTSTRAP_EMAIL` must both be set; the Login ID you type must match exactly. Password is checked against that Supabase user’s email. If `AUTH_BOOTSTRAP_LOGIN_ID` is empty, bootstrap is off.
   - **Profile**: Otherwise the app looks up `public.profiles.login_id`. If there is no row or `login_id` does not match, you get “Invalid ID or password”.
2. **Session cookies** — Sign-in runs in `/api/auth/signin`; the response must include `Set-Cookie` for Supabase. If 2FA says “Session expired”, the password step did not persist cookies (try another browser, ensure you are not blocking cookies, restart dev server after `.env` changes).
3. **Supabase** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and **`SUPABASE_SERVICE_ROLE_KEY`** must all be set. Wrong project or missing service role breaks lookups and admin calls.
4. **Email not confirmed** — In development, the API may return Supabase’s error text (e.g. email confirmation). Confirm the user in the Supabase dashboard or disable confirmation for testing.
5. **`AUTH_BOOTSTRAP_SKIP_2FA`** — Use `true`, `1`, or `yes`. Without it, `profiles.phone_number` must be set and 2FA runs (Twilio in production; in dev the code is logged to the server console).

## 1. Run Migration

Run `supabase/migrations/002_custom_auth.sql` in Supabase SQL Editor.

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in values. **Do not commit real passwords** to Git; set the account password only in **Supabase → Authentication → Users** (or when creating the user).

```
# Required for auth
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Bootstrap CEO / admin login (optional)
# Login form: Login ID + password. Password is verified by Supabase for AUTH_BOOTSTRAP_EMAIL.
AUTH_BOOTSTRAP_LOGIN_ID=your_login_id
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

### Bootstrap login (`AUTH_BOOTSTRAP_EMAIL` required)

1. In Supabase, create (or use) an Auth user whose **email** matches `AUTH_BOOTSTRAP_EMAIL` and set their **password** there to the password you will use at sign-in.
2. Set **`AUTH_BOOTSTRAP_SKIP_2FA=true`** until Twilio is configured or if you have no `profiles` row yet (otherwise SMS 2FA requires `profiles.phone_number`).
3. At **/login**, you can type **either**:
   - the same string as **`AUTH_BOOTSTRAP_LOGIN_ID`** (if set), **or**
   - your **`AUTH_BOOTSTRAP_EMAIL`** (case-insensitive),  
   then your Supabase password. You do **not** need `profiles.login_id` for that to work when using the email or matching bootstrap ID.
4. Optionally set **`AUTH_ALLOW_EMAIL_SIGNIN=true`** to allow **any** user to sign in with their **email** as the Login ID field (still needs `SKIP_2FA` or profile + phone for 2FA).

If `AUTH_BOOTSTRAP_SKIP_2FA` is not `true`, the user must have a `profiles` row with `phone_number` for SMS 2FA.

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
