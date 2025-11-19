# Frontend (Vite + React + Tailwind)

This frontend is a minimal React app using Vite and Tailwind CSS.

Local quick start (Windows / PowerShell):

```powershell
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

Open http://localhost:3000

Deployment to Vercel

1. Push this repository to GitHub.
2. On Vercel, import the repository and set the Project's Root to the repository root (Vercel will read `vercel.json`).
3. Set an environment variable on Vercel named `VITE_API_BASE` to your backend's public URL (for example `https://your-backend.example.com`).
	- The frontend uses `import.meta.env.VITE_API_BASE` in production; if unset it will default to `/api` which works only when the API is proxied in the same domain.
4. Build command: `npm run build` (Vercel will run this automatically using `frontend/package.json` as configured in `vercel.json`).
5. After deploy you can open the frontend URL; it will call the backend at `VITE_API_BASE`.

Notes & Backend

- Development proxy: in dev the Vite server proxies `/api` to `http://localhost:5000` (see `vite.config.js`).
- The backend must be deployed separately (e.g., Render, Heroku, Railway, or Vercel Serverless functions) and a public URL provided via `VITE_API_BASE`.
- Auth token is stored in localStorage under `token` and is sent as `Authorization: Bearer <token>`.

If you want, I can add a small serverless backend wrapper or a single GitHub Action to deploy the backend too; tell me where you plan to host the backend and I’ll add tailored instructions.
