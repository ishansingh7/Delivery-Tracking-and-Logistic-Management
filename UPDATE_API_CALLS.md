# 📝 How to Update API Calls for Deployment

Your code currently has hardcoded `http://localhost:5000` everywhere. Here's how to update it.

---

## OPTION 1: Quick - Just Update .env Files (Recommended for Quick Deploy)

### Frontend, Admin, and Logistic folders:

**Step 1:** Create/Update `.env.local` file:

```
VITE_API_URL=https://delivery-app-backend.onrender.com
```

**Step 2:** In your components, replace:

```javascript
// ❌ OLD - Don't use this
const res = await fetch('http://localhost:5000/api/delivery/create')

// ✅ NEW - Use this
const API_URL = import.meta.env.VITE_API_URL
const res = await fetch(`${API_URL}/api/delivery/create`)
```

---

## OPTION 2: Better - Use the Config File (Recommended for Long-term)

I've created `src/config/api.js` in each frontend. Use it like this:

### Step 1: Import the helper:

```javascript
import { apiCall } from '../config/api'
```

### Step 2: Use it instead of fetch:

```javascript
// ❌ OLD
const res = await fetch('http://localhost:5000/api/delivery/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})

// ✅ NEW (much cleaner!)
const res = await apiCall('/api/delivery/create', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

---

## EXAMPLE: Updating a Component

### `Frontend/src/Compoments/Tracking/ShipmentsTracking.jsx`

**Current code:**
```javascript
const fetchShipment = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/track/${trackingId}`);
    const data = await res.json();
    setShipment(data);
  } catch (error) {
    console.error(error);
  }
};
```

**Updated code (Option 1):**
```javascript
const API_URL = import.meta.env.VITE_API_URL

const fetchShipment = async () => {
  try {
    const res = await fetch(`${API_URL}/api/track/${trackingId}`);
    const data = await res.json();
    setShipment(data);
  } catch (error) {
    console.error(error);
  }
};
```

**Updated code (Option 2 - Better):**
```javascript
import { apiCall } from '../../config/api'

const fetchShipment = async () => {
  try {
    const data = await apiCall(`/api/track/${trackingId}`);
    setShipment(data);
  } catch (error) {
    console.error(error);
  }
};
```

---

## FILES THAT NEED UPDATES

### Frontend:
- [ ] `Frontend/src/Compoments/Nevbar/Nevbar.jsx` - Change links
- [ ] `Frontend/src/Compoments/Tracking/ShipmentsTracking.jsx` - Line 48
- [ ] `Frontend/src/Compoments/ServicesDelivery/Delivery/StartServices/Domestic.jsx` - Line 37
- [ ] Search for `localhost:5000` in all files

### Admin:
- [ ] `admin/src/Compoments/Home/AdminHome.jsx` - Lines 30-32
- [ ] Search for `localhost:5000` in all files

### Logistic:
- [ ] `logistic/src/Compomnets/Login/Login.jsx` - Line 17
- [ ] `logistic/src/Compomnets/HomeProfile/Dashboard.jsx` - Line 48
- [ ] Search for `localhost:5000` in all files

---

## STEP-BY-STEP FIX FOR EACH APP

### Frontend:

**1. Create `.env.local`:**
```
VITE_API_URL=https://delivery-app-backend.onrender.com
```

**2. Update `Nevbar.jsx`:**
Change from:
```javascript
<a href="http://localhost:5174">Admin</a>
<a href="http://localhost:5173">Logistic</a>
```
To:
```javascript
<a href="https://delivery-admin.vercel.app">Admin</a>
<a href="https://delivery-logistic.vercel.app">Logistic</a>
```

**3. Update `ShipmentsTracking.jsx`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL
const res = await fetch(`${API_URL}/api/track/${trackingId}`)
```

**4. Update `Domestic.jsx`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL
const response = await fetch(`${API_URL}/api/delivery/create`, {
```

---

### Admin:

**1. Create `.env.local`:**
```
VITE_API_URL=https://delivery-app-backend.onrender.com
```

**2. Update `AdminHome.jsx`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL

const domesticRes = await fetch(`${API_URL}/api/admin/deliveries`)
const internationalRes = await fetch(`${API_URL}/api/admin/international/deliveries`)
const driversRes = await fetch(`${API_URL}/api/delivery/auth/all-agents`)
```

---

### Logistic:

**1. Create `.env.local`:**
```
VITE_API_URL=https://delivery-app-backend.onrender.com
```

**2. Update `Login.jsx`:**
```javascript
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const res = await axios.post(`${API_URL}/api/delivery/auth/login`, {
  // ... rest of code
})
```

**3. Update `Dashboard.jsx`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL

axios.get(`${API_URL}/api/delivery/myorders/${userId}`)
```

---

## AFTER UPDATING

**Locally test:**
```bash
npm run dev
# Try logging in, tracking, creating delivery
# Check browser console for any errors
```

**Git commit:**
```bash
git add .
git commit -m "Update API URLs for deployment"
git push
```

**Deploy:**
- Vercel will auto-detect changes
- Redeploy on each platform
- Test all features on live URLs

---

## QUICK FIND & REPLACE

Use VS Code Find & Replace (Ctrl+H):

**Find:** `http://localhost:5000`
**Replace:** `https://delivery-app-backend.onrender.com`

**Click "Replace All"** (carefully - in each app folder separately)

⚠️ **After deploying**, you might want to change back to using `.env` files for flexibility.

---

## TESTING

After updates, run locally:
```bash
npm run dev
```

Check browser console (F12):
- No `fetch()` errors
- No `404` errors
- API calls going to correct domain

If you see errors, check the .env file is set correctly.
