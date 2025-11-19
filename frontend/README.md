# Frontend (Vite + React + Tailwind)

This frontend is a minimal React app using Vite and Tailwind CSS. It expects the backend API to be running on http://localhost:5000 (the dev server proxies /api to that address).

Quick start (windows/powershell):

```powershell
cd backend
npm install
npm run dev # or node index.js depending on backend setup

cd ../frontend
npm install
npm run dev
```

Open http://localhost:3000

Notes:
- API base is proxied to /api in development via `vite.config.js`.
- Authentication token is stored in localStorage under `token`.
