# 🧪 Test Production Build Locally

Before deploying, it's a good idea to test your production build locally to catch any issues.

## Test Backend Locally

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already done)
npm install

# Start backend in production mode
NODE_ENV=production npm start

# Test health endpoint in another terminal
curl http://localhost:5000/health

# Test basketball stats endpoint
curl http://localhost:5000/basketball-stats | head -n 20
```

## Test Frontend Production Build

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Create production build
npm run build

# Preview the production build locally
npm run preview
# This should open http://localhost:4173
```

## Test Full Stack Locally

1. **Start Backend**: `cd backend && NODE_ENV=production npm start`
2. **Start Frontend Preview**: `cd frontend && npm run preview`
3. **Test Functionality**:
   - Open http://localhost:4173
   - Test player search
   - Test filtering
   - Click on a player profile
   - Check browser console for errors

## Verify Build Files

### Backend Build Check
```bash
cd backend
npm run build
ls dist/
# Should see compiled JavaScript files
```

### Frontend Build Check
```bash
cd frontend
npm run build
ls dist/
# Should see index.html, assets folder, etc.
```

## Common Local Testing Issues

1. **CORS Errors**: Normal when testing preview - will be fixed in production
2. **Port Conflicts**: Make sure ports 5000 and 4173 are available
3. **Build Errors**: Check all imports and dependencies are correct

If everything works locally, you're ready to deploy! 🚀 