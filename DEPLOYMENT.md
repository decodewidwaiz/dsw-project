# Deployment Guide for Vercel

This guide explains how to deploy both the backend and frontend of this application to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. Vercel CLI installed (`npm install -g vercel`)
3. Git repository for the project
4. Groq API key (get one at [console.groq.com](https://console.groq.com))

## Backend Deployment

### 1. Prepare the Backend

The backend has already been prepared for Vercel deployment with:
- Serverless functions in the `api/` directory
- `vercel.json` configuration file
- Proper CORS settings

### 2. Set Environment Variables

Before deploying, you need to set the following environment variables in Vercel:

- `GROQ_API_KEY` - Your Groq API key
- `HF_TOKEN` - Your Hugging Face token (if needed)

### 3. Deploy Using Vercel CLI

Navigate to the backend directory and deploy:

```bash
cd backend
vercel
```

Follow the prompts:
- Set up and deploy? `Y`
- Which scope? Select your Vercel account
- Link to existing project? `N` (or `Y` if you already have a project)
- What's your project's name? Enter a name
- In which directory is your code located? `./`

### 4. Configure Environment Variables in Vercel Dashboard

After deployment:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the required environment variables

### 5. Redeploy

After setting environment variables, redeploy:
```bash
vercel --prod
```

Note the URL of your deployed backend (e.g., `https://your-backend-project.vercel.app`).

## Frontend Deployment

### 1. Update Environment Variables

Update the `.env.production` file in the frontend directory with your actual backend URL:

```
VITE_API_BASE_URL=https://your-backend-project.vercel.app
```

### 2. Deploy Using Vercel CLI

Navigate to the frontend directory and deploy:

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? `Y`
- Which scope? Select your Vercel account
- Link to existing project? `N` (or `Y` if you already have a project)
- What's your project's name? Enter a name
- In which directory is your code located? `./`
- Want to override the settings? `N`

### 3. Redeploy for Production

Deploy to production:
```bash
vercel --prod
```

## Manual Deployment via Vercel Dashboard

Alternatively, you can deploy both projects manually via the Vercel dashboard:

1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository or upload files
4. For the backend:
   - Set the root directory to `backend`
   - Framework preset: "Other"
   - Build command: (leave empty)
   - Output directory: (leave empty)
5. For the frontend:
   - Set the root directory to `frontend`
   - Framework preset: "Vite"
   - Build command: `npm run build`
   - Output directory: `dist`
6. Add environment variables in the "Environment Variables" section
7. Deploy!

## Troubleshooting

### Environment Variables Not Set

If you get errors about missing API keys:
1. Ensure all environment variables are set in the Vercel dashboard
2. Redeploy the application

### CORS Issues

If you encounter CORS errors:
1. Check that the CORS configuration in the backend is correct
2. Ensure the frontend is using the correct backend URL

### Build Failures

If builds fail:
1. Check that all dependencies are correctly listed in package.json
2. Ensure Node.js version is compatible (Vercel uses Node.js 18.x by default)