# 🏢 VisitorHub

![VisitorHub Banner](https://img.shields.io/badge/VisitorHub-Real--World_MERN_App-0284c7?style=for-the-badge)

A fully responsive, enterprise-ready **Visitor Management System** built on the MERN stack (MongoDB, Express, React, Node.js). VisitorHub features a clean "Soft Pastel" UI, robust Role-Based Access Control (RBAC), and dual authentication (Google OAuth 2.0 & secure local JWT auth).

### 🚀 Live Demo
**[🟢 View Live Demo](https://frontend-ivory-iota-f6vrwrvxwc.vercel.app)**  
*(Note: Google Login on the live demo requires your Google account to be authorized in the project's OAuth settings)*

---

## ✨ Features

- **Dual Authentication**: Secure login via Google OAuth 2.0 or local Username/Password.
- **Role-Based Access Control (RBAC)**: 
  - **Admin**: Full access to register, edit, export, and securely **delete** visitor records. (First Google user defaults to Admin).
  - **Receptionist**: Restricted access to view, search, and register visitors.
- **Real-time Dashboard**: Track total visitors and today's visitor count at a glance.
- **Advanced Search & Export**: Filter visitors by name or mobile number in real-time, and export logs to CSV.
- **Modern UI**: Clean, professional "Soft Pastel" aesthetic with smooth transitions and glass-like components.

---

## 🛠️ Tech Stack

**Frontend (Vite + React)**
- `React 18` (Context API for State Management)
- `@react-oauth/google` (Google Authentication)
- `Axios` (API Communication)
- `Lucide-React` (Modern Iconography)
- Pure CSS (Custom Soft Pastel / Calm aesthetic)

**Backend (Node.js + Express)**
- `Express.js` (REST API architecture)
- `MongoDB` via `Mongoose` (Database Schema & Validation)
- `google-auth-library` (OAuth Token Verification)
- `jsonwebtoken` & `bcryptjs` (Local Auth & Password Hashing)
- `cors` (Cross-Origin Resource Sharing)

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Cloud Console Account (For OAuth Client ID)

### 1. Clone the repository
```bash
git clone https://github.com/codesbysam/visitorhub.git
cd visitorhub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```
Run the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Update `main.jsx` with your Google Client ID:
```javascript
const GOOGLE_CLIENT_ID = 'your_google_oauth_client_id';
```
Run the frontend dev server:
```bash
npm run dev
```

---

## 🔐 Default Demo Accounts

If you are running the project locally, the backend automatically seeds two test accounts upon startup:
- **Admin**: `admin` / `adminpassword`
- **Receptionist**: `receptionist` / `receptionpassword`

---

## 📦 Production Deployment

This project is configured for seamless deployment:
- **Frontend**: Deploy to [Vercel](https://vercel.com/) (Includes `vercel.json` for React Router support).
- **Backend**: Deploy to [Render](https://render.com/) (Standard Node.js environment).

*Designed and Built for enterprise visitor tracking.*
