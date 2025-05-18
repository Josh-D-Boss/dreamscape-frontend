# Dreamscape Events – Fullstack Website

A futuristic, immersive event curation website with multi-page frontend and fully functional backend.

---

## What's Included
- Elegant, mobile-ready frontend (HTML, TailwindCSS, JS)
- Functional booking system (Node.js, MongoDB, Email)
- Admin dashboard (charts, export, auth)
- Email notifications (to admin and client)
- Excel export of all bookings

---

## Folder Structure
```
dreamscape/
├── frontend/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── book.html
│   ├── thank-you.html
│   ├── styles.css
│   ├── scripts.js
│   └── assets/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── .env.template
│   └── public/
│       └── admin.html
```

---

## Deployment Instructions

### 1. Frontend on Vercel
1. Push `frontend/` files to a new GitHub repo (e.g. `dreamscape-frontend`)
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
3. Import the repo, click **Deploy**
4. Your site will be live (e.g. `dreamscape.vercel.app`)

### 2. Backend on Render
1. Push `backend/` files to another GitHub repo (e.g. `dreamscape-backend`)
2. Go to [https://render.com](https://render.com)
3. Create new **Web Service**, link GitHub
4. Fill in:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables (copy from `.env.template`)
6. Deploy → Copy your backend URL

### 3. MongoDB (Atlas)
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free cluster
3. Add a DB user
4. Whitelist all IPs
5. Create DB `dreamscape`
6. Copy connection string to use in `MONGO_URI`

---

## Admin Access
- Visit `/admin` (e.g. `https://your-api.onrender.com/admin`)
- Use the `ADMIN_USER` / `ADMIN_PASS` from `.env`
- Charts auto-refresh every 3 mins
- Export bookings to Excel anytime

---

## Notes
- The booking form submits to `/api/book`
- Data is saved to MongoDB and emailed to you
- Both admin and client receive email confirmation
- You can customize styling, content, and features further

---

Enjoy your Dreamscape Website!
