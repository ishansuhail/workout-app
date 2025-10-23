# Clerk Webhook Setup Guide

This guide will help you automatically sync Clerk users to your Supabase database.

## 🎯 What This Does

When a user signs up with Clerk, their information is automatically added to your `users` table in Supabase. This allows you to:

- Link workouts to users
- Query user data alongside other data
- Maintain referential integrity

## 📋 Step 1: Add Webhook Secret to `.env.local`

Add this to your `.env.local` file (we'll get the value in the next step):

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

## 🔧 Step 2: Set Up Webhook in Clerk Dashboard

### 1. Start Your Development Server

First, expose your local server using ngrok or a similar tool:

```bash
# Option A: Using ngrok (recommended)
# Install: brew install ngrok
ngrok http 3000

# Option B: Using Cloudflare Tunnel
# Install: brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:3000
```

You'll get a URL like: `https://abc123.ngrok.io` or `https://xyz.trycloudflare.com`

### 2. Configure Webhook in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **Webhooks** in the sidebar
4. Click **+ Add Endpoint**
5. Enter your endpoint URL:
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/clerk
   ```
6. Select the following events:
   - ✅ `user.created`
   - ✅ `user.updated` (optional)
   - ✅ `user.deleted` (optional)
7. Click **Create**

### 3. Copy the Webhook Secret

1. After creating the webhook, click on it
2. Find the **Signing Secret** section
3. Click **Show** and copy the secret (starts with `whsec_`)
4. Add it to your `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### 4. Restart Your Dev Server

```bash
npm run dev
```

## ✅ Step 3: Test the Webhook

### Test Sign Up Flow:

1. Make sure your database tables are created:

   ```bash
   npm run db:push
   ```

2. Go to your app: `http://localhost:3000`

3. Click "Get Started" and create a new account

4. Check your Clerk Dashboard → Webhooks → Your endpoint

   - You should see a successful delivery (200 status)

5. Open Drizzle Studio to verify the user was added:
   ```bash
   npm run db:studio
   ```
   - Open the `users` table
   - You should see the new user!

## 🚀 Step 4: Deploy to Production

When deploying to production (e.g., Vercel):

### 1. Deploy Your App

```bash
vercel deploy
```

You'll get a production URL like: `https://workout-app.vercel.app`

### 2. Update Webhook Endpoint

1. Go back to Clerk Dashboard → Webhooks
2. Edit your webhook endpoint
3. Change the URL to your production URL:
   ```
   https://workout-app.vercel.app/api/webhooks/clerk
   ```

### 3. Add Environment Variables

In your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `CLERK_WEBHOOK_SECRET` (same value from .env.local)
   - `DATABASE_URL` (your Supabase connection string)
   - All other env vars from `.env.local`

## 🔍 Debugging

### Check Webhook Logs

In Clerk Dashboard → Webhooks → Your endpoint:

- You can see all webhook deliveries
- Click on any delivery to see the request/response
- If it failed, you'll see the error

### Check Your API Logs

View your webhook logs:

```bash
# In your terminal running `npm run dev`
# You should see:
✅ User created in database: user@example.com
```

### Common Issues

**Issue: Webhook returns 400/401**

- Make sure the endpoint is in the public routes (middleware.ts)
- Verify CLERK_WEBHOOK_SECRET is correct

**Issue: User not appearing in database**

- Check that `npm run db:push` was successful
- Make sure DATABASE_URL is correct
- Check the webhook logs in Clerk Dashboard

**Issue: "password authentication failed"**

- Your DATABASE_URL password is incorrect
- Reset your Supabase password and update .env.local

## 🎉 You're Done!

Now whenever someone signs up:

1. Clerk creates the user account
2. Clerk sends a webhook to your API
3. Your API creates the user in Supabase
4. User can now create workouts linked to their account!

## 📚 Next Steps

- Create a page to view/edit user profile
- Add more webhook events (user.updated, user.deleted)
- Add error notifications for failed webhook deliveries
