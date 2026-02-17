# Netlify Deployment Guide (Hindi + English)

## चरण 1: Backend Deploy करें (पहले यह करें!)

आपका chatbot **full-stack app** है इसलिए दो चीज़ें अलग-अलग deploy करनी होंगी:
- **Frontend** → Netlify पर
- **Backend** → Render/Railway पर

### Backend को Render पर Deploy करें:

1. **Render.com पर जाएं**: https://render.com
2. **Sign up** करें (GitHub से connect करें)
3. **New → Web Service** चुनें
4. अपना repository select करें
5. निम्नलिखित settings भरें:

```
Name: chatbot-backend
Root Directory: backend
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

6. **Environment Variables** add करें:
```
GEMINI_API_KEY = AIzaSyCkF-9MO_ofGhhSIPyKl79tF-MsBSlbpmY
MONGO_URL = mongodb://localhost:27017
DB_NAME = chatbot_db
CORS_ORIGINS = *
```

7. **Deploy** button दबाएं

8. Deploy होने के बाद आपको URL मिलेगा जैसे:
   `https://chatbot-backend-xyz.onrender.com`

---

## चरण 2: MongoDB Atlas Setup (Optional but Recommended)

अगर आप production में deploy कर रहे हैं:

1. **MongoDB Atlas** पर जाएं: https://www.mongodb.com/cloud/atlas
2. **Free cluster** बनाएं
3. **Database User** बनाएं
4. **Network Access** में `0.0.0.0/0` allow करें
5. **Connection string** copy करें
6. Render में `MONGO_URL` update करें

---

## चरण 3: Netlify पर Frontend Deploy करें

### Option A: Netlify Dashboard से (आसान तरीका)

1. **Netlify Dashboard** खोलें: https://app.netlify.com
2. **Add new site → Import an existing project**
3. अपना **GitHub repository** connect करें
4. निम्नलिखित settings भरें:

```
Base directory: frontend
Build command: yarn build
Publish directory: frontend/build
```

5. **Environment variables** section में add करें:
```
REACT_APP_BACKEND_URL = https://chatbot-backend-xyz.onrender.com
```
(अपना actual backend URL यहां डालें)

6. **Deploy site** button दबाएं

### Option B: Netlify CLI से

```bash
# Netlify CLI install करें
npm install -g netlify-cli

# Login करें
netlify login

# Frontend directory में जाएं
cd frontend

# Deploy करें
netlify deploy --prod
```

---

## चरण 4: CORS Fix करें

Backend deploy होने के बाद:

1. Render dashboard में जाएं
2. Environment Variables में `CORS_ORIGINS` update करें:
```
CORS_ORIGINS = https://your-app-name.netlify.app
```

3. Backend को redeploy करें (या automatically restart होगा)

---

## Common Errors और Solutions

### Error 1: "Build failed" on Netlify

**कारण**: Build command या directory गलत है

**समाधान**:
```
Base directory: frontend
Build command: yarn install && yarn build
Publish directory: frontend/build
```

### Error 2: "API calls failing" / CORS Error

**कारण**: Backend URL गलत है या CORS configure नहीं है

**समाधान**:
1. Netlify dashboard → Site settings → Environment variables
2. `REACT_APP_BACKEND_URL` check करें
3. Backend में `CORS_ORIGINS` में Netlify URL add करें

### Error 3: "Module not found"

**कारण**: Dependencies install नहीं हुई

**समाधान**:
Build command को update करें:
```
yarn install && yarn build
```

### Error 4: Backend "Application failed to start"

**कारण**: Environment variables missing हैं

**समाधान**:
Render में check करें:
- `GEMINI_API_KEY` ✓
- `MONGO_URL` ✓
- `DB_NAME` ✓
- `CORS_ORIGINS` ✓

---

## Testing After Deployment

### Backend Test:
```bash
curl https://your-backend.onrender.com/api/
```

Expected response: `{"message":"Chatbot API is running"}`

### Frontend Test:
1. अपनी Netlify site खोलें
2. "New Chat" button दबाएं
3. कोई message type करें
4. AI response आना चाहिए

---

## Important Notes

### Free Tier Limitations:

**Netlify (Free Tier):**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic SSL
- ⚠️ No custom domains (upgrade needed)

**Render (Free Tier):**
- ✅ Free web services
- ⚠️ **Cold starts**: 50 seconds sleep after 15 min inactivity
- ✅ Automatic deployments from Git
- ✅ Free PostgreSQL (500 MB)

**MongoDB Atlas (Free Tier):**
- ✅ 512 MB storage
- ✅ Shared clusters
- ⚠️ Limited connections

**Gemini API (Free Tier):**
- Rate limits लागू होते हैं
- Check करें: https://ai.google.dev/pricing

---

## Quick Commands

```bash
# Frontend build test करने के लिए
cd frontend
yarn install
yarn build

# Backend test करने के लिए
cd backend
pip install -r requirements.txt
uvicorn server:app --reload

# Git push करने के लिए
git add .
git commit -m "Deploy to Netlify"
git push origin main
```

---

## Structure का सही होना ज़रूरी है:

```
your-repo/
├── netlify.toml          ← Root में होना चाहिए
├── frontend/
│   ├── package.json
│   ├── src/
│   └── public/
└── backend/
    ├── server.py
    └── requirements.txt
```

---

## अगर अभी भी problem है तो:

1. **Netlify Build Logs** check करें:
   - Site settings → Deploys → Latest deploy → View logs

2. **Browser Console** check करें:
   - F12 दबाएं → Console tab
   - कोई error दिख रहा है?

3. **Backend Logs** check करें:
   - Render dashboard → Logs tab

4. **Environment Variables** verify करें:
   - Netlify dashboard में `REACT_APP_BACKEND_URL`
   - Render dashboard में सभी backend env vars

---

## Support

अगर किसी specific error का सामना कर रहे हैं, तो:
1. Error message copy करें
2. Build logs screenshot लें
3. मुझे share करें

Main turant fix kar dunga! 🚀
