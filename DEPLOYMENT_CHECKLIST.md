# Deployment Checklist ✅

## Pre-Deployment (Local Testing)

- [ ] App locally chal raha hai?
  ```bash
  cd backend && uvicorn server:app --reload
  cd frontend && yarn start
  ```

- [ ] Backend API kaam kar raha hai?
  ```bash
  curl http://localhost:8001/api/
  ```

- [ ] Frontend build ho raha hai?
  ```bash
  cd frontend && yarn build
  ```

---

## Step 1: Backend Deployment (Render)

- [ ] Render.com पर account बनाया
- [ ] New Web Service बनाया
- [ ] Repository connect किया
- [ ] Settings configure की:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `pip install -r requirements.txt`
  - [ ] Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

- [ ] Environment Variables add किये:
  - [ ] `GEMINI_API_KEY`
  - [ ] `MONGO_URL`
  - [ ] `DB_NAME`
  - [ ] `CORS_ORIGINS` (अभी के लिए `*`)

- [ ] Backend deploy हो गया
- [ ] Backend URL copy किया (जैसे: `https://chatbot-backend-xyz.onrender.com`)

- [ ] Backend test किया:
  ```bash
  curl https://your-backend.onrender.com/api/
  ```

---

## Step 2: MongoDB Setup (Optional)

अगर MongoDB Atlas use कर रहे हैं:

- [ ] MongoDB Atlas account बनाया
- [ ] Free cluster create किया
- [ ] Database user बनाया
- [ ] Network access allow किया (0.0.0.0/0)
- [ ] Connection string copy किया
- [ ] Render में `MONGO_URL` update किया

---

## Step 3: Frontend Deployment (Netlify)

### Netlify Dashboard Method:

- [ ] Netlify पर account बनाया
- [ ] "Add new site → Import an existing project"
- [ ] GitHub repository connect किया
- [ ] Build settings configure की:
  - [ ] Base directory: `frontend`
  - [ ] Build command: `yarn install && yarn build`
  - [ ] Publish directory: `frontend/build`

- [ ] Environment variable add किया:
  - [ ] `REACT_APP_BACKEND_URL` = आपका backend URL

- [ ] Deploy button दबाया
- [ ] Site URL मिला (जैसे: `https://your-app.netlify.app`)

### Ya Git Push Method:

- [ ] Code push किया:
  ```bash
  git add .
  git commit -m "Ready for deployment"
  git push origin main
  ```

- [ ] Netlify automatically deploy कर रहा है
- [ ] Build logs check किये

---

## Step 4: CORS Fix

- [ ] Netlify URL copy किया
- [ ] Render dashboard में गया
- [ ] `CORS_ORIGINS` environment variable update किया
  ```
  CORS_ORIGINS = https://your-app.netlify.app
  ```
- [ ] Backend redeploy किया (या auto-restart हो गया)

---

## Step 5: Testing

- [ ] Frontend site खोली
- [ ] "New Chat" button दबाया
- [ ] Message भेजा
- [ ] AI response मिला ✅

- [ ] Multiple conversations test किये
- [ ] Theme toggle test किया
- [ ] Mobile view check किया

---

## Step 6: Post-Deployment

- [ ] Custom domain add किया (optional)
- [ ] SSL certificate verify किया (auto by Netlify)
- [ ] Analytics setup किया (optional)
- [ ] Error monitoring setup किया (optional)

---

## Troubleshooting

### अगर Frontend build fail हो:
```bash
# Local build test करें
cd frontend
yarn install
yarn build
```

### अगर API calls fail हो रहे हैं:
1. Browser console check करें (F12)
2. Network tab में errors देखें
3. `REACT_APP_BACKEND_URL` verify करें
4. Backend CORS settings check करें

### अगर Backend start नहीं हो रहा:
1. Render logs check करें
2. Environment variables verify करें
3. `requirements.txt` में सभी packages हैं check करें

---

## Useful Commands

```bash
# Local test build
./test-build.sh

# Deploy to Netlify manually
cd frontend && netlify deploy --prod

# Check backend logs
# Render dashboard → Your service → Logs

# Check frontend logs
# Netlify dashboard → Deploys → Latest deploy → Deploy log
```

---

## Free Tier Limits

- **Netlify**: 100 GB bandwidth/month
- **Render**: Free tier has cold starts
- **MongoDB Atlas**: 512 MB storage
- **Gemini API**: Check https://ai.google.dev/pricing

---

## Done! 🎉

Agar sab checkboxes ✅ हैं, तो congratulations! 
Aapka chatbot successfully deploy ho gaya hai!

**Site URL**: https://your-app.netlify.app  
**Backend URL**: https://your-backend.onrender.com
