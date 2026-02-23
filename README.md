# 🚀 ReachMe - Premium Link-in-Bio Platform

ReachMe is a highly customizable, premium link-in-bio platform built for creators, professionals, and brands. It allows users to aggregate their digital presence into a single, beautiful, and highly engaging page.

Initially prototyped with Supabase, ReachMe is now powered by a robust **custom MERN stack** (MongoDB, Express, React, Node.js) to support advanced authentication, custom rate-limiting, and premium creator features.

## ✨ Key Features

* **Advanced Customization:** Fully editable themes, background colors/images, custom fonts, and button styles.
* **Story Mode (Video Greetings):** Instagram-style glowing avatar rings that play vertical video greetings when clicked.
* **Auto-Sync Dynamic Links:** Paste an RSS or YouTube feed URL, and ReachMe will automatically fetch and display your latest content.
* **Secure Authentication:** OAuth 2.0 (Google & GitHub) and Email/Password auth, protected via strict HttpOnly JWT cookies.
* **Drag-and-Drop Management:** Seamlessly reorder links using DnD Kit.
* **Live Phone Preview:** Real-time visual feedback while editing your profile.
* **Interactive Modules:** Built-in "Support Me" (Tipping) buttons and Newsletter subscription blocks.
* **Smart Contact Links:** Direct-to-app WhatsApp messaging and seamless "Gmail Compose" redirects.
* **Downloadable QR Codes:** Canvas-generated QR codes that prompt "Open Link" natively on iOS/Android.

## 🛠️ Tech Stack

**Frontend (Client)**
* React (Vite)
* Tailwind CSS (Styling)
* Framer Motion (Animations)
* Zustand (Global State Management)
* DnD Kit (Drag and Drop)
* Lucide React (Icons)
* Hosted on **Netlify**

**Backend (Server)**
* Node.js & Express
* MongoDB & Mongoose (Database)
* Passport.js (Google & GitHub OAuth)
* JWT (HttpOnly Cookies for Auth)
* Cloudinary API (Image & Video Storage with secure auto-deletion)
* `rss-parser` (Dynamic feed fetching)
* Hosted on **Render**

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` files.

### Backend (`/backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database & Auth
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth (Optional for local testing)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret