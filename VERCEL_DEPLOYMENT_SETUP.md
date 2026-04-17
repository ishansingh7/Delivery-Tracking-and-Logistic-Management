# 🚀 Vercel Deployment Setup Guide

## Problem Solved ✅

All hardcoded `http://localhost:5000` URLs have been replaced with **environment variables** that use `VITE_API_URL`. This allows your frontends to:
- Work locally with `http://localhost:5000`
- Work on Vercel pointing to your Render backend
- Switch backends without code changes

---

## 📝 Environment Variables Setup

### For ALL THREE FRONTENDS (Frontend, Admin, Logistic)

Each frontend now reads from `VITE_API_URL` environment variable.

#### **Local Development** (already set up):
Create a `.env.local` file in each frontend folder:

**Frontend/.env.local**
```
VITE_API_URL=http://localhost:5000
```

**admin/.env.local**
```
VITE_API_URL=http://localhost:5000
```

**logistic/.env.local**
```
VITE_API_URL=http://localhost:5000
```

#### **Production on Vercel** (you need to add):
Set environment variable in Vercel dashboard.

---

## 🔧 Step-by-Step Vercel Setup

### For **Frontend** App:

1. **Go to** https://vercel.com/dashboard
2. **Click** "Add New..." → "Project"
3. **Import** your GitHub repository
4. **Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
     (Replace with your ACTUAL Render backend URL)
   - Click "Deploy"

### For **Admin** App:

1. **New Project** (don't re-deploy Frontend)
2. **Root Directory**: `admin/`
   - **IMPORTANT**: Must set root directory to `admin`
3. **Environment Variables**:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com`

### For **Logistic** App:

1. **New Project**
2. **Root Directory**: `logistic/`
   - **IMPORTANT**: Must set root directory to `logistic`
3. **Environment Variables**:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com`

---

## ✅ What Changed in Code

All files now dynamically read API URL:

```javascript
// BEFORE (hardcoded - BROKEN in production):
const response = await fetch("http://localhost:5000/api/delivery/create", {...});

// AFTER (uses environment variable):
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/delivery/create`, {...});
```

### Files Updated:

**Frontend (3 files):**
- `Frontend/src/Compoments/ServicesDelivery/Delivery/StartServices/Domestic.jsx`
- `Frontend/src/Compoments/ServicesDelivery/Delivery/StartServices/International.jsx`
- `Frontend/src/Compoments/Tracking/ShipmentsTracking.jsx`

**Admin (6 files):**
- `admin/src/Compoments/DomesticDelivery/DomesticDelivery.jsx` (4 API calls + image URLs)
- `admin/src/Compoments/InternationalDelivery/InternationalDelivery.jsx` (4 API calls)
- `admin/src/Compoments/Home/AdminHome.jsx` (3 API calls)
- `admin/src/Compoments/ManageDeliveries/ManageDeliveries.jsx` (2 API calls + image URLs)
- `admin/src/Compoments/Tracking/TrackDelivery.jsx` (1 API call)
- `admin/src/Compoments/DeliveryAgents/DeliveryAgents.jsx` (4 API calls + image URLs)

**Logistic (8 files):**
- `logistic/src/Compomnets/Login/Login.jsx` (1 API call)
- `logistic/src/Compomnets/Login/Register.jsx` (1 API call)
- `logistic/src/Compomnets/HomeProfile/Dashboard.jsx` (2 API calls + image URLs)
- `logistic/src/Compomnets/HomeProfile/EditProfile.jsx` (1 API call)
- `logistic/src/Compomnets/HomeProfile/Home.jsx` (1 API call + image URL)
- `logistic/src/Compomnets/TakeOders/Dispalyoder/AcceptOrders.jsx` (2 API calls)
- `logistic/src/Compomnets/TakeOders/Dispalyoder/DisplayDomesticOrders.jsx` (3 API calls)
- `logistic/src/Compomnets/TakeOders/Dispalyoder/DisplayInternationalOrders.jsx` (2 API calls)
- `logistic/src/Compomnets/TakeOders/Dispalyoder/DisplayOders.jsx` (2 API calls)

**Total: 17 files updated, 30+ API calls fixed**

---

## 🧪 Testing

### Before Pushing:

1. **Test locally**:
   ```bash
   npm run dev
   ```
   Should still work with localhost

2. **Check all 3 frontends load**:
   - http://localhost:5173 (Frontend)
   - http://localhost:5174 (Admin)
   - http://localhost:5175 (Logistic)

### After Vercel Deployment:

1. Visit each Vercel deployment URL
2. Try submitting a delivery request (Frontend)
3. Try logging in (Logistic)
4. Check Admin dashboard

---

## 🐛 Debugging Deployment Errors

### Error: "Cannot GET /"
✅ **Fixed**: Added root endpoint to Backend Server.js

### Error: "Cannot submission delivery request"
✅ **Fixed**: API endpoints now use environment variables

### Error: "CORS error" or "Cannot connect to backend"
- Check Vercel environment variable is set correctly
- Verify `VITE_API_URL` is your actual Render backend URL
- Ensure Render backend is running (check https://dashboard.render.com)

### Error: "Images not loading"
✅ **Fixed**: Image URLs now use environment variables

---

## 📦 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Set `VITE_API_URL` in Vercel for Frontend
- [ ] Set `VITE_API_URL` in Vercel for Admin (root dir: `admin`)
- [ ] Set `VITE_API_URL` in Vercel for Logistic (root dir: `logistic`)
- [ ] Test each deployed site
- [ ] URLs you should have:
  - Frontend: https://delivery-frontend.vercel.app
  - Admin: https://delivery-admin.vercel.app
  - Logistic: https://delivery-logistic.vercel.app
  - Backend: https://your-backend.onrender.com

---

## ❓ Need Help?

Common issues and solutions:

**Frontend keeps calling localhost:**
→ Make sure `.env.local` has `VITE_API_URL=http://localhost:5000`

**Vercel deployment fails:**
→ Check build logs in Vercel dashboard and look for "VITE_API_URL" mentions

**Images/uploads not loading:**
→ Verify image URLs start with full VITE_API_URL path

---

## 🎯 Next Steps

1. Commit and push to GitHub: `git push origin main`
2. Deploy to Vercel: Link your GitHub repo
3. Set environment variables in Vercel
4. Test each app
5. Share your live URLs!

