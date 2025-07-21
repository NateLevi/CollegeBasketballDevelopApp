# 🚀 Deployment Guide

This guide will walk you through deploying your Illinois Basketball Analytics app to production.

## 📋 Prerequisites

- GitHub account (to connect your repositories)
- Render account (for backend deployment)
- Netlify account (for frontend deployment)

## 🔧 Step 1: Deploy Backend to Render

### 1.1 Prepare Your Repository
```bash
# Make sure all your changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Create Render Service
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Choose your repository and the `backend` folder as the root directory

### 1.3 Configure Render Settings
```
Service Name: illinois-basketball-api (or your choice)
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 1.4 Environment Variables
In Render, add these environment variables:
```
NODE_ENV=production
PORT=10000
```

### 1.5 Deploy
- Click "Create Web Service"
- Wait for deployment (usually 5-10 minutes)
- Note your backend URL: `https://your-service-name.onrender.com`

## 🎯 Step 2: Update Frontend Configuration

### 2.1 Update API Configuration
Edit `frontend/src/config/api.ts` and replace the production URL:

```typescript
production: {
  apiUrl: 'https://your-actual-render-url.onrender.com'  // Replace with your Render URL
}
```

### 2.2 Update Backend CORS
Edit `backend/server.ts` and update the CORS configuration:

```typescript
origin: process.env.NODE_ENV === 'production' 
  ? [
      'https://your-actual-netlify-url.netlify.app', // Replace with your Netlify URL
      'https://*.netlify.app'
    ]
```

## 🌐 Step 3: Deploy Frontend to Netlify

### 3.1 Prepare Frontend Build
```bash
cd frontend
npm run build
# This creates a 'dist' folder with your production build
```

### 3.2 Create Netlify Site
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Choose your repository

### 3.3 Configure Netlify Settings
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### 3.4 Environment Variables
In Netlify, add this environment variable:
- Key: `VITE_API_URL`
- Value: `https://your-render-backend-url.onrender.com`

### 3.5 Deploy
- Click "Deploy site"
- Wait for deployment (usually 2-5 minutes)
- Note your frontend URL: `https://your-site-name.netlify.app`

## 🔄 Step 4: Update CORS Configuration

Now that you have your Netlify URL, update your backend CORS:

1. Go back to your `backend/server.ts` file
2. Replace `'https://your-netlify-app.netlify.app'` with your actual Netlify URL
3. Commit and push the changes
4. Render will automatically redeploy your backend

## ✅ Step 5: Test Your Deployment

1. Visit your Netlify URL
2. Test all functionality:
   - Player search
   - Filtering
   - Player profiles
   - Navigation between pages

## 🛠️ Troubleshooting

### Backend Issues
- Check Render logs: Go to your service → "Logs"
- Verify environment variables are set correctly
- Test API endpoints: `https://your-backend-url.onrender.com/health`

### Frontend Issues
- Check Netlify deploy logs: Go to your site → "Deploys"
- Verify environment variables are set correctly
- Check browser console for CORS errors

### CORS Errors
- Make sure your Netlify URL is added to backend CORS configuration
- Ensure both URLs (with and without trailing slash) are allowed

## 📱 Step 6: Custom Domain (Optional)

### For Netlify (Frontend)
1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain
3. Follow DNS setup instructions

### For Render (Backend)
1. In Render dashboard, go to your service settings
2. Add custom domain
3. Update frontend API configuration with new domain

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Only allow your frontend domain
3. **HTTPS**: Both services provide HTTPS by default
4. **API Keys**: If you add any API keys, store them in environment variables

## 📊 Monitoring

- **Render**: Monitor backend performance and logs
- **Netlify**: Monitor frontend analytics and function logs
- **Uptime**: Consider using services like UptimeRobot for monitoring

## 💰 Cost Considerations

- **Render**: Free tier includes 750 hours/month (enough for one app)
- **Netlify**: Free tier includes 100GB bandwidth/month
- **Scaling**: Both services offer paid plans for higher usage

---

## 🚀 Quick Deploy Commands

After initial setup, for future deployments:

```bash
# Deploy backend (automatic on git push)
git add .
git commit -m "Update backend"
git push origin main

# Deploy frontend (automatic on git push)
git add .
git commit -m "Update frontend" 
git push origin main
```

Your app will be live at:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend**: `https://your-service-name.onrender.com`

🎉 **Congratulations! Your Illinois Basketball Analytics app is now live!** 