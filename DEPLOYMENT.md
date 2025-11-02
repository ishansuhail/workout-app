# Vercel Deployment Guide

## Prerequisites

1. GitHub account
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. All environment variables ready

## Environment Variables Required

Add these environment variables in Vercel Project Settings → Environment Variables:

### Database

```
DATABASE_URL=postgresql://user:password@host:port/database
```

- Get this from your Supabase project dashboard
- Go to Project Settings → Database → Connection String
- Use "Transaction" pooling mode for serverless

### Supabase

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

- Get from Supabase Project Settings → API

### Clerk Authentication

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

- Get from Clerk Dashboard → API Keys
- For webhook secret: Create a new webhook endpoint in Clerk

### OpenAI

```
LLM_API_KEY=sk-proj-...
```

- Get from OpenAI Platform → API Keys

### Optional

```
WORKOUT_NAMESPACE=6ba7b810-9dad-11d1-80b4-00c04fd430c8
```

- UUID for deterministic workout ID generation (has default)

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub repository
4. Configure Project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3. Add Environment Variables

In Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add all variables from above
3. Select environment: Production, Preview, Development (or just Production)

### 4. Configure Clerk Webhook

After first deployment:

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to Clerk Dashboard → Webhooks
3. Add endpoint: `https://your-app.vercel.app/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the webhook secret and add to Vercel env vars as `CLERK_WEBHOOK_SECRET`
6. Redeploy your app

### 5. Database Setup

Ensure your database is accessible:

1. **Supabase**: No additional config needed (uses connection pooler)
2. Verify DATABASE_URL uses correct pooling mode
3. Run migrations if needed:
   ```bash
   npm run db:push
   ```

### 6. Deploy!

Click "Deploy" and Vercel will:

- Install dependencies
- Build your Next.js app
- Deploy to global CDN

## Post-Deployment

### Verify Functionality

1. ✅ Authentication works (Clerk sign in/sign up)
2. ✅ Database queries work
3. ✅ Chat API works (OpenAI)
4. ✅ Webhooks work (check Clerk logs)

### Set Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### Monitor

- View logs: Project → Deployments → Click deployment → Runtime Logs
- Check analytics: Project → Analytics

## Troubleshooting

### Build Errors

**Issue**: Build fails with missing environment variables

- **Fix**: Add all required env vars in Vercel settings

**Issue**: Database connection timeout

- **Fix**: Use Supabase connection pooler URL (ends with `:6543/postgres`)

### Runtime Errors

**Issue**: 500 errors on API routes

- **Fix**: Check Runtime Logs in Vercel dashboard
- **Fix**: Verify all env vars are set correctly

**Issue**: Clerk webhook not working

- **Fix**: Verify webhook URL in Clerk dashboard
- **Fix**: Check CLERK_WEBHOOK_SECRET is set in Vercel

### Database Issues

**Issue**: "connection pool exhausted"

- **Fix**: Use Supabase Transaction pooler
- **Fix**: Close connections properly (Drizzle handles this)

## Updating Your App

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel will automatically redeploy on push to main branch.

## Environment Variables Reference

| Variable                            | Required | Purpose                      |
| ----------------------------------- | -------- | ---------------------------- |
| `DATABASE_URL`                      | Yes      | PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL`          | Yes      | Supabase project URL         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Yes      | Supabase anonymous key       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Clerk public key             |
| `CLERK_SECRET_KEY`                  | Yes      | Clerk secret key             |
| `CLERK_WEBHOOK_SECRET`              | Yes      | Clerk webhook verification   |
| `LLM_API_KEY`                       | Yes      | OpenAI API key               |
| `WORKOUT_NAMESPACE`                 | No       | UUID namespace (has default) |

## Production Checklist

- [ ] All environment variables added
- [ ] Database is accessible
- [ ] Clerk webhook configured
- [ ] First deployment successful
- [ ] Authentication tested
- [ ] Database queries tested
- [ ] Chat/AI features tested
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Clerk Docs: [clerk.com/docs](https://clerk.com/docs)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
