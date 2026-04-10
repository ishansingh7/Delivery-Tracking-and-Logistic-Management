# Complete Deployment Guide - Delivery App

This guide covers deploying all parts of your delivery application.

---

## **STEP 1: Prepare Your Project**

### 1.1 Check Environment Variables
Create a `.env` file in the **Backend** folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
NODE_ENV=production
```

Get the MongoDB URI from Step 2 below.

### 1.2 Build Frontend Apps
Run these in each frontend folder (Frontend, Admin, Logistic):

```bash
npm install
npm run build
```

This creates a `dist` folder with optimized files.

---

## **STEP 2: Deploy MongoDB Database (Free)**

### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up Free"**
3. Create account and log in
4. Click **"Create"** → Select **"M0 (Free)"**
5. Choose region closest to you
6. Complete security setup
7. Click **"Connect"** → **"Drivers"**
8. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
9. Replace `<password>` and `<username>` with your actual credentials
10. Save this for backend deployment

---

## **STEP 3: Deploy Backend**

### Option A: Deploy on Render.com (Easiest)

1. Go to https://render.com
2. Click **"Sign Up"** (use GitHub for easier setup)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo (or paste repo URL)
5. Fill in settings:
   - **Name**: `delivery-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node Server.js`
   - **Plan**: Free
6. Add Environment Variables:
   - Click **"Advanced"**
   - Add:
     ```
     PORT = 5000
     MONGODB_URI = [your MongoDB connection string from Step 2]
     NODE_ENV = production
     ```
7. Click **"Create Web Service"** and wait (5-10 minutes)
8. Copy the deployed URL (e.g., `https://delivery-app-backend.onrender.com`)

### Option B: Deploy on Railway.app

1. Go to https://railway.app
2. Click **"Login"** (use GitHub)
3. Create new project
4. Connect your GitHub repo
5. Select **Backend** folder as root
6. Add variables same as above
7. Deploy and copy URL

**Save your backend URL - needed for frontends!**

---

## **STEP 4: Deploy Frontends on Vercel**

### Deploy Frontend App

1. Go to https://vercel.com
2. Click **"Sign Up"** (use GitHub)
3. Click **"Import Project"**
4. Select your GitHub repo
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   VITE_API_URL = https://your-backend-url.onrender.com
   ```
7. Click **"Deploy"** (2-3 minutes)
8. Get frontend URL

### Deploy Admin App
Repeat the same process:
- Root Directory: `admin`
- Same VITE_API_URL

### Deploy Logistic App
Repeat the same process:
- Root Directory: `logistic`
- Same VITE_API_URL

---

## **STEP 5: Update API Endpoints in Code**

You'll need to update your frontend code to use the deployed backend URL instead of localhost.

Search for `localhost:5000` or `http://localhost` in your components and replace with your backend URL.

Example in a React component:
```javascript
// Before
const response = await fetch('http://localhost:5000/api/delivery/...')

// After
const response = await fetch('https://your-backend-url.onrender.com/api/delivery/...')
```

Or create a .env file in each frontend:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

Then use in components:
```javascript
const API_URL = import.meta.env.VITE_API_URL
const response = await fetch(`${API_URL}/api/delivery/...`)
```

---

## **STEP 6: Testing**

After deployment:

1. ✅ Test Backend API:
   - Visit: `https://your-backend-url.onrender.com/api/track` (or any working endpoint)
   - Should see data or no error

2. ✅ Test Frontends:
   - Visit each Vercel URL
   - Check if they load
   - Try logging in (check console for API errors)

3. ✅ Check Logs:
   - **Render**: Dashboard → Your Service → Logs
   - **Vercel**: Project → Deployments → Logs

---

## **STEP 7: Custom Domain (Optional)**

### Point Domain to Vercel (Frontend)
1. Buy domain from GoDaddy, Namecheap, etc.
2. Add your domain in Vercel project settings
3. Update DNS records as shown in Vercel

### Point Domain to Render (Backend)
1. Add custom domain in Render service settings
2. Update DNS records

---

## **TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| **Backend won't start** | Check logs, verify MongoDB connection string in .env |
| **Frontend shows blank page** | Check browser console for API errors, verify VITE_API_URL |
| **CORS errors** | Backend cors() should allow your frontend domains |
| **Database connection fails** | Verify MongoDB Atlas IP whitelist (allow all 0.0.0.0/0) |
| **Uploads not working** | Verify multer path, use cloud storage (AWS S3 recommended) |

---

## **COST BREAKDOWN (Monthly)**

- MongoDB Atlas: **FREE** (up to 5GB)
- Render Backend: **FREE** (or $7/month for reliability)
- Vercel Frontends: **FREE** (or paid for more builds)
- **Total**: $0-21/month

---

## **NEXT STEPS**

1. ✅ Set up MongoDB Atlas account
2. ✅ Deploy backend first
3. ✅ Get backend URL
4. ✅ Update frontend code with backend URL
5. ✅ Deploy all frontends
6. ✅ Test everything
7. ✅ Set up custom domain (if needed)

**Questions?** Check service documentation or reply with specific errors!
