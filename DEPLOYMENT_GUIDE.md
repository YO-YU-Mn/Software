# 🚀 Deployment Guide - MERN Stack Application

## ✅ Completed: Environment Variables Setup

### Files Created/Updated:
✅ `Backend/.env` - Backend configuration (with sensitive data)
✅ `Backend/.env.example` - Template for backend env
✅ `Frontend/frontend/.env` - Frontend configuration  
✅ `Frontend/frontend/.env.example` - Template for frontend env
✅ `Frontend/frontend/admin_dashboard/.env` - Admin dashboard configuration
✅ `Frontend/frontend/admin_dashboard/.env.example` - Template for admin env

### All API URLs Updated:
✅ **Backend**: Updated to use `process.env.MONGODB_URI`, `process.env.PORT`, `process.env.JWT_SECRET`
✅ **Frontend**: All 20+ API calls updated to use `import.meta.env.VITE_API_URL`
✅ **Admin Dashboard**: All API calls updated to use environment variables

---

## 📋 Step-by-Step Deployment Process

### **Phase 1: Database Setup (MongoDB Atlas)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create a free account
3. Create a **Free Project**
4. Click **"Build Database"** → Select **Free M0**
5. Choose your region (closest to you)
6. Create database user (remember username & password)
7. Network Access:
   - Click **"Security"** → **"Network Access"**
   - Click **"Add IP Address"** → Select **"Allow from anywhere"** (0.0.0.0/0)
8. Click **"Drivers"** → Copy connection string
9. Replace `<username>` and `<password>` with your credentials
10. Update in `Backend/.env`:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourdatabase?retryWrites=true&w=majority
    ```

---

### **Phase 2: Deploy Backend to Railway**

#### 2.1 Create Railway Account
- Go to https://railway.app
- Click **"Start Project"**
- Sign in with GitHub

#### 2.2 Connect Repository
- Click **"New Project"**
- Click **"Deploy from GitHub"**
- Select your repository
- Select **Backend** folder
- Railway auto-detects Node.js

#### 2.3 Add Environment Variables
In Railway Dashboard:
1. Click **Variables** tab
2. Add these variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourdatabase
   PORT=9000
   JWT_SECRET=university_secret_key
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key
   ```

#### 2.4 Configure CORS
Update `Backend/server.js` CORS settings:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend.vercel.app',
    'https://your-admin.vercel.app'
  ],
  credentials: true
}));
```

#### 2.5 Copy Railway URL
- After deployment, Railway provides URL like: `https://xxxxx-production.railway.app`
- Save this for next step

---

### **Phase 3: Deploy Frontend to Vercel**

#### 3.1 Deploy Main Frontend
1. Go to https://vercel.com
2. Click **"New Project"**
3. Select GitHub repository
4. Configure:
   - **Root Directory**: `Frontend/frontend`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-railway-url
   ```
6. Click **"Deploy"**

#### 3.2 Deploy Admin Dashboard  
1. Click **"New Project"** in Vercel
2. Select same GitHub repository
3. Configure:
   - **Root Directory**: `Frontend/frontend/admin_dashboard`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-railway-url
   ```
5. Click **"Deploy"**

---

### **Phase 4: Update CORS in Backend**

After getting Vercel URLs, update `Backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-admin.vercel.app',
    'https://your-frontend-staging.vercel.app'  // optional preview deployments
  ],
  credentials: true
}));
```

**Redeploy backend** on Railway to apply changes.

---

## 🔑 Environment Variables Reference

### Backend `.env` Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=9000
JWT_SECRET=your_secret_key
NODE_ENV=production
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

### Frontend `.env` Variables
```
VITE_API_URL=https://your-backend-railway-url
```

### Admin Dashboard `.env` Variables
```
VITE_API_URL=https://your-backend-railway-url
```

---

## ✅ Testing Your Deployment

### 1. Test Backend API
```bash
# Open in browser or use curl
https://your-backend-railway-url/students/all

# Should return JSON response (or error if no token)
```

### 2. Test Frontend
- Visit: `https://your-frontend.vercel.app`
- Check browser console for errors
- Try logging in
- Verify API calls work

### 3. Test Admin Dashboard
- Visit: `https://your-admin.vercel.app`
- Try adding/viewing data
- Check if API calls succeed

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Errors | Update `Backend/server.js` CORS whitelist and redeploy |
| API 404 Errors | Verify `VITE_API_URL` is correct in frontend `.env` files |
| MongoDB Connection Failed | Check IP whitelist in MongoDB Atlas (0.0.0.0/0) |
| Environment Variables Not Loading | Redeploy after adding variables in platform dashboard |
| "Cannot find module 'dotenv'" | Run `npm install dotenv` in Backend and commit `package.json` |
| Vercel Build Failed | Check build logs for missing dependencies |
| Railway Deployment Failed | Check Railway logs for database connection issues |

---

## 📝 Important Notes

### Security Checklist
- ✅ Never commit `.env` files to GitHub
- ✅ Always use `.env.example` templates
- ✅ Store sensitive keys only in platform dashboards
- ✅ Use environment-specific values (dev vs production)
- ✅ Rotate secrets regularly

### File Structure for Deployment
```
Backend/
├── .env (git ignored)
├── .env.example (committed)
├── .gitignore
└── server.js

Frontend/frontend/
├── .env (git ignored)
├── .env.example (committed)
└── ...

Frontend/frontend/admin_dashboard/
├── .env (git ignored)
├── .env.example (committed)
└── ...
```

### .gitignore Example
```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/

# OS files
.DS_Store
Thumbs.db
```

---

## 📱 Next Steps After Deployment

1. **Monitor Logs**
   - Railway: Dashboard → Logs tab
   - Vercel: Dashboard → Deployments → View logs

2. **Set Up Custom Domain** (Optional)
   - Railway: Settings → Custom Domain
   - Vercel: Settings → Domains

3. **Enable Auto Deployments**
   - Both platforms auto-deploy on git push
   - Configure branch deployments in settings

4. **Backup Strategy**
   - MongoDB Atlas: Enable backups (Backup → Settings)
   - GitHub: Already backed up
   - Test restoration process

---

## 💡 Alternative Deployment Platforms

If you want alternatives:

| Platform | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **Render** | Backend | $7/month | Node.js servers |
| **Heroku** | Backend | Discontinued | (Not recommended) |
| **Netlify** | Frontend | ∞ | React apps |
| **AWS Free Tier** | All | 12 months | Scalable apps |
| **DigitalOcean** | All | $5/month | Full control |

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- MERN Deployment Guide: https://www.freecodecamp.org/news/how-to-deploy-mern/

---

**Status**: Ready for Deployment ✅
**Last Updated**: May 8, 2026
