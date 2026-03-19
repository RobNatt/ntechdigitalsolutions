# Gmail Integration Setup

Connect your Gmail account to send and receive emails through the dashboard.

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Gmail API**: APIs & Services → Library → search "Gmail API" → Enable

## 2. OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the **OAuth consent screen**:
   - User type: **External** (for testing) or **Internal** (Google Workspace only)
   - App name: **nTech Digital Solutions**
   - Add scopes: `gmail.readonly`, `gmail.send`, `gmail.compose`, `gmail.modify`
   - Add your email as a test user (if External)
4. Application type: **Web application**
5. Name: e.g. "nTech Dashboard"
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/gmail/callback` (development)
   - `https://yourdomain.com/api/gmail/callback` (production)
7. Copy the **Client ID** and **Client Secret**

## 3. Environment Variables

Add to `.env.local`:

```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
```

For production, set `GOOGLE_REDIRECT_URI` to your production callback URL.

## 4. Run Migration

Run `supabase/migrations/003_gmail_connections.sql` in Supabase SQL Editor to create the `gmail_connections` table.

## 5. Connect Gmail

1. Run the app locally: `npm run dev`
2. Open **http://localhost:3000** in your browser
3. Sign in with your ID and password (complete 2FA if prompted)
4. You'll land on the **Dashboard** – the **Email** tab is selected by default
5. In the Email section header (below "Email"), click the **Connect Gmail** button
6. Authorize the app in the Google consent screen
7. You'll be redirected back to the dashboard with Gmail connected

## Scopes Used

- `gmail.readonly` – Read emails
- `gmail.send` – Send emails
- `gmail.compose` – Manage drafts
- `gmail.modify` – Labels and folders

## Troubleshooting

- **"Gmail not connected"** – Ensure you've completed the OAuth flow and the migration has been run
- **"Redirect URI mismatch"** – Verify `GOOGLE_REDIRECT_URI` matches exactly what's in Google Cloud Console
- **"Access blocked"** – If using External app type, add your email as a test user in the OAuth consent screen
