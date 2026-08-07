# 🚔 TVDS — AI Smart Traffic Violation Detection System
## Complete Setup Guide

---

## ✅ What's Already Working (No Setup Needed)

The app runs **fully out-of-the-box** in demo mode:
- Beautiful animated Landing Page
- Login / Signup (any Police ID + 6-char password works)
- Dashboard with live charts and statistics
- Upload Evidence (drag-and-drop any image/video)
- AI Detection (mock engine with realistic confidence scores, bounding boxes)
- Violation Records (8 sample records, searchable/filterable/sortable)
- Analytics (charts, pie graphs, trend lines)
- Hotspot Heatmap
- Smart Alerts
- Reports (PDF + CSV download)
- Officer Performance Dashboard
- Profile Page with edit

---

## 🔧 What You Need to Set Up

### 1. Firebase Project (for real authentication and database)

**Step 1** — Go to https://console.firebase.google.com/
**Step 2** — Click "Add project" → name it "tvds-system" → Continue
**Step 3** — Enable Google Analytics → Create project
**Step 4** — In the left sidebar → "Build" → "Authentication" → Get started → Email/Password → Enable
**Step 5** — In the left sidebar → "Build" → "Firestore Database" → Create database → Start in test mode
**Step 6** — In the left sidebar → "Build" → "Storage" → Get started → production mode
**Step 7** — Click the gear icon ⚙ → "Project settings" → scroll to "Your apps" → click `</>` (Web)
**Step 8** — Register app as "TVDS Web" → copy the firebaseConfig values

**Step 9** — Create `.env` file in the project root:
```
cp .env.example .env
```
Then paste your Firebase values:
```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tvds-system.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tvds-system
VITE_FIREBASE_STORAGE_BUCKET=tvds-system.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

### 2. Roboflow API (for real AI detection)

**Step 1** — Go to https://roboflow.com/ → Sign up free
**Step 2** — Go to Universe → search "traffic violation detection"
**Step 3** — Find a model (e.g., "Traffic-Signs-6mnbt" or "helmet-detection")
**Step 4** — Click the model → "Deploy" → copy the API key and model endpoint
**Step 5** — Add to your `.env`:
```env
VITE_ROBOFLOW_API_KEY=your_key_here
VITE_ROBOFLOW_MODEL_ID=your_model_id
VITE_ROBOFLOW_VERSION=1
```
**Step 6** — Update `src/services/aiDetection.js` — uncomment the real API call at the bottom of the file

---

## 🚀 Running the App

```bash
# Install dependencies (already done if you cloned)
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173

# Build for production
npm run build
```

---

## 📦 Deploying to Vercel (Frontend)

**Step 1** — Push this folder to GitHub
```bash
git init
git add .
git commit -m "Initial TVDS commit"
git remote add origin https://github.com/YOUR_USERNAME/tvds.git
git push -u origin main
```

**Step 2** — Go to https://vercel.com/ → Import your GitHub repo
**Step 3** — Add your environment variables in Vercel Project Settings → Environment Variables
**Step 4** — Deploy → Done! ✅

---

## 🗄️ Firestore Security Rules

Paste these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated officers can read/write violations
    match /violations/{doc} {
      allow read, write: if request.auth != null;
    }
    // Officers can only read/write their own profile
    match /officers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Alerts readable by all authenticated users
    match /alerts/{doc} {
      allow read: if request.auth != null;
      allow write: if false; // Server-side only
    }
  }
}
```

---

## 📁 Project Structure

```
traffic-violation-system/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx          ← Animated landing (hero, features, FAQ)
│   │   ├── LoginPage.jsx            ← Officer sign in
│   │   ├── SignupPage.jsx           ← Officer registration
│   │   ├── DashboardPage.jsx        ← Main dashboard with charts
│   │   ├── UploadPage.jsx           ← Drag-and-drop evidence upload
│   │   ├── ProcessingPage.jsx       ← AI scanning animation
│   │   ├── ResultsPage.jsx          ← Detection results + annotated image
│   │   ├── RecordsPage.jsx          ← Violation records table
│   │   ├── AnalyticsPage.jsx        ← Charts and statistics
│   │   ├── HotspotsPage.jsx         ← Heatmap visualization
│   │   ├── AlertsPage.jsx           ← Smart alerts feed
│   │   ├── ReportsPage.jsx          ← PDF/CSV report generation
│   │   ├── PerformancePage.jsx      ← Officer performance dashboard
│   │   └── ProfilePage.jsx          ← Officer profile management
│   ├── components/
│   │   └── layout/
│   │       └── AppLayout.jsx        ← Sidebar + header layout
│   ├── contexts/
│   │   └── AuthContext.jsx          ← Auth state management
│   ├── services/
│   │   ├── firebase.js              ← Firebase config
│   │   └── aiDetection.js           ← Mock + real AI detection
│   ├── utils/
│   │   └── mockData.js              ← Sample data for demo
│   ├── App.jsx                      ← Router setup
│   ├── main.jsx                     ← Entry point
│   └── index.css                    ← Global styles + design system
├── .env.example                     ← Environment variables template
├── vite.config.js
└── index.html
```

---

## 🎨 Design System Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0F172A` | App background |
| Sidebar | `#020617` | Sidebar dark |
| Primary Blue | `#2563EB` | Primary actions |
| Accent Cyan | `#06B6D4` | Secondary accents |
| Success Green | `#22C55E` | Success states |
| Warning Orange | `#F97316` | Medium severity |
| Danger Red | `#EF4444` | High/Critical violations |

---

## ✨ Unique Features Implemented

| Feature | Status |
|---------|--------|
| Violation Severity Score | ✅ Low / Medium / High / Critical badges |
| Repeat Offender Tracker | ✅ Auto-flag on results page |
| AI Recommendation Engine | ✅ Per-violation type recommendations |
| Violation Hotspot Analytics | ✅ Heatmap grid + ranked locations |
| Officer Performance Dashboard | ✅ Leaderboard + radar chart |
| Smart Alert System | ✅ Categorized alert feed |
| Evidence Authenticity Indicator | ✅ SHA-256 hash + timestamp |
| Smart City Readiness Module | ✅ On dashboard |

---

## 🔑 Demo Login

Use any Police ID (e.g., `POL-9821`) and any password with 6+ characters to log in.
