# HeartWise Deployment

## Recommended setup

- Frontend: Vercel
- Backend: Render

## 1. Backend deployment on Render

- Push this repo to GitHub.
- In Render, create a new `Web Service`.
- Select this repo.
- Render can use [render.yaml](/c:/Users/thesh/OneDrive/Desktop/Heart-Disease-Prediction/render.yaml), or you can configure manually:
  - Root directory: `backend`
  - Build command: `pip install -r requirements.txt`
  - Start command: `gunicorn app:app`

### Backend environment variables

Add these in Render under Environment:

- `GEMINI_API_KEY` = your real Gemini API key
- `GEMINI_MODEL` = `gemini-1.5-flash`
- `CORS_ALLOW_ORIGIN` = your frontend URL
- `FLASK_DEBUG` = `false`

Example:

- `CORS_ALLOW_ORIGIN=https://your-frontend-name.vercel.app`

## 2. Frontend deployment on Vercel

- In Vercel, import the same GitHub repo.
- Set the project root directory to `frontend`.
- Framework preset: `Create React App`

### Frontend environment variables

Add this in Vercel:

- `REACT_APP_API_BASE_URL` = your deployed backend URL

Example:

- `REACT_APP_API_BASE_URL=https://your-backend-name.onrender.com`

## 3. Local development

### Backend

From the `backend` folder:

```powershell
pip install -r requirements.txt
copy .env.example .env
```

Then put your real key in `backend/.env`:

```env
GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-1.5-flash
CORS_ALLOW_ORIGIN=http://localhost:3000
FLASK_DEBUG=true
```

Start it:

```powershell
python app.py
```

### Frontend

From the `frontend` folder:

```powershell
npm install
copy .env.example .env
npm start
```

If needed, set:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:5000
```

## Important

- Put `GEMINI_API_KEY` only in the backend environment.
- Never place the Gemini key in React or `REACT_APP_*` variables.
- After changing frontend environment variables on Vercel, redeploy the frontend.
- After changing backend environment variables on Render, redeploy the backend.
