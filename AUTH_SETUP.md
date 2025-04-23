# Authentication Setup Guide for WhatsApp Bot Admin

This document provides instructions for setting up Google authentication with Supabase for the WhatsApp Bot Admin Panel.

## Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. In your Supabase project dashboard, navigate to **Authentication** → **Providers**
3. Enable Google OAuth provider
4. Copy your Supabase URL and anon key to the `.env` file:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   ```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Configure Consent Screen**:
   - Select "External" user type
   - Fill in the required information (app name, user support email, developer contact)
   - Add the scopes: `.../auth/userinfo.email`, `...auth/userinfo.profile`, and `openid`
   - Add your domains in the authorized domains section (include "localhost" for development)
5. Return to **Credentials** tab and click **Create Credentials** → **OAuth Client ID**:
   - Application type: Web application
   - Name: WhatsApp Bot Admin (or your preferred name)
   - Authorized JavaScript origins: Add both your production URL and development URL (e.g., `http://localhost:8000`)
   - Authorized redirect URIs: 
     - Add the Supabase callback URL from your Supabase dashboard (under Authentication → Providers → Google)
     - Also add: `http://localhost:8000/login/success/*` for local development

## Local Development Setup

1. Make sure your `.env` file contains all required credentials (as shown above)
2. Run the development server with `deno task dev`
3. Access the site at `http://localhost:8000`

## Authentication Flow

The authentication flow works as follows:

1. User visits the site and is redirected to the login page if not authenticated
2. User clicks "Continue with Google" and is redirected to Google for authentication
3. After successful authentication, Google redirects back to the Supabase callback URL
4. Supabase processes the authentication and redirects to our login success page
5. The AuthListener component sets cookies and redirects to the dashboard
6. Protected routes check authentication via middleware and redirect to login if not authenticated

## File Structure

- `clients/browserClient.ts` - Client-side Supabase client
- `clients/supabase.ts` - Server-side Supabase client
- `sdk/auth.tsx` - Authentication utilities and hooks
- `utils/auth.ts` - Authentication helper functions
- `utils/jwt.ts` - JWT utilities
- `islands/AuthListener.tsx` - Component for handling auth state changes
- `routes/login/index.tsx` - Login page
- `routes/login/success/[...redirect].tsx` - Success page for handling redirects
- `routes/api/auth/signout.ts` - API endpoint for signing out
- `routes/_middleware.ts` - Authentication middleware

## Troubleshooting

If you're having issues with authentication:

1. Check browser console for errors
2. Verify your environment variables are correctly set
3. Make sure your redirect URLs are correctly configured in both Supabase and Google OAuth
4. Check the Supabase authentication logs in your Supabase dashboard
5. Ensure cookies are working (may require HTTPS in production) 