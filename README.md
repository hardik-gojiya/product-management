(The file `d:\coding\potenz-interview\README.md` exists, but contains only whitespace)

# Product Management

Quick notes to run backend locally:

1. Copy `backend/.env.example` to `backend/.env` and set values:
	- `MONGODB_URI` (or `MONGO_URI`)
	- `JWT_SECRET`
	- `PORT` (optional, defaults to 5000)

2. Start backend:

```powershell
cd backend
npm install
npm run dev
```

3. Start frontend (optional):

```powershell
cd frontend
npm install
npm run dev
```

If you see the error "The `uri` parameter to `openUri()` must be a string, got \"undefined\"", it means your MongoDB connection string isn't set in the environment. Set `MONGODB_URI` or `MONGO_URI` in `backend/.env`.

 
