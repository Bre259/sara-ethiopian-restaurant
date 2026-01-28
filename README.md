# Sara Ethiopian Restaurant — Website

Full-stack website with a **Node/Express backend** and static **frontend**, ready to run locally and deploy online.

---

## What's included

- **Frontend** (in `public/`): HTML, CSS, JS — hero, about, menu, experience, gallery, contact, and **contact + reservation forms**.
- **Backend** (`server.js`): Serves the frontend and provides:
  - `POST /api/contact` — name, email, message
  - `POST /api/reservations` — name, email, phone, date, time, guests, note
  - `GET /api/health` — for load balancers and platforms

Submissions are logged to the console and optionally stored in `data/contacts.json` and `data/reservations.json` (when the app has write access to disk).

---

## Run locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server** (frontend + backend)
   ```bash
   npm start
   ```

3. Open **http://localhost:3000** in your browser.

The same server serves the site and the API. Contact and reservation forms submit to `/api/contact` and `/api/reservations`.

---

## Publish online

The app is a **single Node.js server** that serves both the frontend and the API, so you deploy it as one **Web Service**.

### Option 1: Render

1. Push the project to **GitHub** (or GitLab / Bitbucket).
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect the repo. Render will detect Node and use `npm install` and `npm start`.
4. (Optional) If you added `render.yaml`, you can use **New** → **Blueprint** and point it at the repo instead.
5. Deploy. Render will assign a URL like `https://sara-ethiopian-restaurant.onrender.com`.

**Note:** On Render’s free tier, the `data/` folder is **ephemeral** (wiped on restarts). For persistent storage, add a Render **Disk** or switch to a database and an email service (e.g. Resend, SendGrid) for contact/reservations.

### Option 2: Railway

1. Push the project to **GitHub**.
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** and select the repo.
3. Railway will detect Node, run `npm install` and `npm start`.
4. Under **Settings** → **Networking** → **Generate Domain** to get a public URL.

### Option 3: Other Node hosts

Any platform that runs Node (e.g. **Fly.io**, **DigitalOcean App Platform**, **Heroku**, a **VPS** with `node` and `npm`) can run:

```bash
npm install
npm start
```

Set `PORT` if the platform expects it (Render, Railway, and most PaaS set it automatically).

---

## Project layout

```
├── public/           # Frontend (served at /)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── data/             # Created at runtime: contacts.json, reservations.json (if writable)
├── server.js         # Express app: static + /api/contact, /api/reservations, /api/health
├── package.json
├── render.yaml       # Optional: Render Blueprint
├── .gitignore
└── README.md
```

---

## Customization

- **Contact info**: Edit the “Visit Us” block and form placeholders in `public/index.html`.
- **Styling**: `public/styles.css` and CSS variables at the top.
- **API behavior**: `server.js` — e.g. add validation, email (Resend/SendGrid), or a DB instead of JSON files.
- **Environment**: Use `process.env.PORT` (already in `server.js`). For secrets (e.g. API keys), use your host’s env vars and `process.env`; never commit `.env` (it’s in `.gitignore`).

---

## Tech

- **Backend:** Node 18+, Express, CORS  
- **Frontend:** HTML, CSS, JS (no build step)  
- **Deploy:** Render, Railway, or any Node host
