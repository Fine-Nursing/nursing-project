# Vercel Environment Variables Setup

## Required Environment Variables for Production

Please add these environment variables in Vercel Dashboard:

```bash
# Backend API URL
NEXT_PUBLIC_BE_URL=https://nurse-backend.duckdns.org:3000

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://geauzfgheltqfrgkviql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYXV6ZmdoZWx0cWZyZ2t2aXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NDk1NzUsImV4cCI6MjA2NDQyNTU3NX0.kZGp7ICI_qKS9XRGZBOOzs5e0KJSNVmKYe2u4OyJOiw

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBnRhlHMlQ_zx5p2-TrfyZ-JKVn4BG5Zn8

# AI FastAPI Server (Optional)
NEXT_PUBLIC_AI_API_URL=http://199.241.139.206:8000
NEXT_PUBLIC_AI_API_KEY=zetjam-Hywfek-2hixka
```

## How to Add in Vercel

1. Go to your Vercel Dashboard
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add each variable above
5. Redeploy the project

## CORS Issue

If you're getting CORS errors with the backend API, the backend needs to allow the Vercel domain:
- Add `https://nursing-project.vercel.app` to CORS allowed origins
- Or use `https://*.vercel.app` for all Vercel preview deployments