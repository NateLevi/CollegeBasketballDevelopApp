# ✅ Deployment Checklist

## Pre-Deployment Checklist

### Backend Preparation ✅
- [x] Updated CORS configuration for production
- [x] Added health check endpoint (`/health`)
- [x] Environment variable handling
- [x] Production-ready server setup (listening on 0.0.0.0)
- [x] Proper error handling and logging
- [x] Updated package.json scripts

### Frontend Preparation ✅
- [x] Created API configuration system (`config/api.ts`)
- [x] Updated all API calls to use environment-based URLs
- [x] Created Netlify configuration (`netlify.toml`)
- [x] Proper build configuration

### Files Ready for Deployment ✅
- [x] `backend/server.ts` - Production-ready backend
- [x] `frontend/src/config/api.ts` - Environment configuration
- [x] `frontend/src/data/mockData.ts` - Updated API calls
- [x] `frontend/src/components/PlayerProgression.tsx` - Updated API calls
- [x] `netlify.toml` - Frontend deployment config
- [x] `DEPLOYMENT.md` - Comprehensive deployment guide

## Deployment Steps

### Step 1: Deploy Backend to Render
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Configure Render service (see DEPLOYMENT.md)
- [ ] Set environment variables: `NODE_ENV=production`
- [ ] Deploy and note backend URL

### Step 2: Update URLs
- [ ] Update `frontend/src/config/api.ts` with real Render URL
- [ ] Update `backend/server.ts` CORS with real Netlify URL (after Step 3)

### Step 3: Deploy Frontend to Netlify
- [ ] Create Netlify account
- [ ] Connect GitHub repository
- [ ] Configure Netlify service (see DEPLOYMENT.md)
- [ ] Set environment variable: `VITE_API_URL=<your-render-url>`
- [ ] Deploy and note frontend URL

### Step 4: Final Configuration
- [ ] Update backend CORS with actual Netlify URL
- [ ] Test all functionality on live site
- [ ] Verify all API endpoints work
- [ ] Test player search, filtering, and profiles

## Testing Checklist

### Frontend Tests
- [ ] App loads without errors
- [ ] Player dashboard displays data
- [ ] Search functionality works
- [ ] Filters work smoothly (sliders, dropdowns)
- [ ] Player profiles load correctly
- [ ] Navigation works between all pages
- [ ] Images load (where available)

### Backend Tests
- [ ] Health check endpoint: `<backend-url>/health`
- [ ] Basketball stats endpoint: `<backend-url>/basketball-stats`
- [ ] Player progression endpoint works
- [ ] Player image endpoint works
- [ ] CORS allows frontend requests

### Performance Tests
- [ ] Page load times are acceptable
- [ ] API response times are reasonable
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

## Environment Variables Summary

### Render (Backend)
```
NODE_ENV=production
```

### Netlify (Frontend)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## URLs to Update

### In `frontend/src/config/api.ts`
```typescript
production: {
  apiUrl: 'https://your-actual-render-url.onrender.com'
}
```

### In `backend/server.ts`
```typescript
origin: process.env.NODE_ENV === 'production' 
  ? [
      'https://your-actual-netlify-url.netlify.app',
      'https://*.netlify.app'
    ]
```

## 🚨 Common Issues

1. **CORS Errors**: Make sure Netlify URL is in backend CORS config
2. **404 Errors**: Ensure Netlify redirects are set up (already in netlify.toml)
3. **API Errors**: Check environment variables are set correctly
4. **Build Errors**: Ensure all dependencies are in package.json

## 🎉 Success Indicators

- [ ] Frontend loads at Netlify URL
- [ ] All player data displays correctly
- [ ] Search and filtering work
- [ ] Player profiles are accessible
- [ ] No CORS errors in browser console
- [ ] Backend health check returns OK

---

Once all items are checked, your Illinois Basketball Analytics app will be live! 🏀 