# Deployment Guide

## Architecture

This chatbot application consists of:
- **Frontend**: React app (can be deployed to Netlify)
- **Backend**: FastAPI Python server (needs to be deployed separately)
- **Database**: MongoDB (can use MongoDB Atlas free tier)

## Option 1: Frontend on Netlify + Backend on Render (Recommended)

### Step 1: Deploy Backend to Render

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select "Web Service"
   - Configure:
     - **Name**: chatbot-backend
     - **Root Directory**: `backend`
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables** in Render dashboard:
   ```
   GEMINI_API_KEY=AIzaSyCkF-9MO_ofGhhSIPyKl79tF-MsBSlbpmY
   MONGO_URL=mongodb+srv://your-cluster.mongodb.net/
   DB_NAME=chatbot_db
   CORS_ORIGINS=https://your-netlify-app.netlify.app
   ```

4. **Deploy** and get your backend URL (e.g., `https://chatbot-backend.onrender.com`)

### Step 2: Setup MongoDB Atlas

1. **Create MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get connection string** and update `MONGO_URL` in Render
4. **Whitelist Render IP** or allow access from anywhere (0.0.0.0/0)

### Step 3: Deploy Frontend to Netlify

1. **Update backend URL** in `/app/frontend/.env.production`:
   ```
   REACT_APP_BACKEND_URL=https://chatbot-backend.onrender.com
   ```

2. **Deploy to Netlify**:
   - Option A: **Using Netlify CLI**
     ```bash
     cd frontend
     npm install -g netlify-cli
     netlify login
     netlify init
     netlify deploy --prod
     ```
   
   - Option B: **Using Netlify Dashboard**
     - Go to https://app.netlify.com/
     - Click "Add new site" → "Import an existing project"
     - Connect your Git repository
     - Configure:
       - **Base directory**: `frontend`
       - **Build command**: `yarn build`
       - **Publish directory**: `frontend/build`
     - Add environment variable:
       - `REACT_APP_BACKEND_URL`: Your Render backend URL
     - Deploy!

3. **Update CORS** in Render:
   - Go back to Render dashboard
   - Update `CORS_ORIGINS` environment variable with your Netlify URL
   - Redeploy backend

---

## Option 2: Full-Stack on Vercel

Vercel supports both React and Python, making it simpler:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`** in project root:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "frontend/package.json", "use": "@vercel/static-build" },
       { "src": "backend/server.py", "use": "@vercel/python" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "backend/server.py" },
       { "src": "/(.*)", "dest": "frontend/$1" }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

---

## Option 3: Full-Stack on Railway

Railway is another good option for full-stack apps:

1. **Sign up** at https://railway.app/
2. **Create new project** from GitHub
3. **Add MongoDB service** (Railway provides free MongoDB)
4. **Configure environment variables**
5. **Deploy** automatically on push

---

## Testing After Deployment

1. **Test backend health**:
   ```bash
   curl https://your-backend-url.onrender.com/api/
   ```

2. **Test conversation creation**:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/conversations \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Chat"}'
   ```

3. **Test frontend**: Visit your Netlify URL and create a chat

---

## Important Notes

### Free Tier Limitations:
- **Render**: Free tier may have cold starts (app sleeps after inactivity)
- **Netlify**: 100GB bandwidth/month free
- **MongoDB Atlas**: 512MB storage free
- **Gemini API**: Free tier has rate limits (check https://ai.google.dev/pricing)

### Security:
- Never commit `.env` files with real API keys to Git
- Use environment variables in deployment platforms
- Update CORS origins to specific domains (not `*`)

### Performance:
- Free tiers may have cold starts
- Consider upgrading to paid tiers for production
- Use environment variables for all configuration

---

## Troubleshooting

### Backend not responding:
- Check Render logs for errors
- Verify environment variables are set
- Check MongoDB connection string

### CORS errors:
- Ensure `CORS_ORIGINS` in backend matches frontend URL
- Include protocol (https://) and no trailing slash

### Gemini API errors:
- Verify API key is correct
- Check quota limits at https://aistudio.google.com/
- Monitor usage at https://console.cloud.google.com/

---

## Quick Deploy Commands

```bash
# Frontend to Netlify
cd frontend
netlify deploy --prod

# Backend to Render (via Git)
git add .
git commit -m "Deploy to Render"
git push origin main
```