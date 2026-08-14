# Sukoon — AI Mental Wellness Companion

*"A calm space for your mind, guided by reflection, mindfulness, and timeless wisdom."*

A MERN stack + Google Gemini mental wellness web app. Signature feature: **Ask Krishna** — a Bhagavad Gita-inspired reflection experience.

## Project Structure

```
sukoon/
├── backend/          Express + MongoDB + Gemini API
└── frontend/          React + Vite + Tailwind
```

## 1. Backend Setup

```bash
cd backend
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and Gemini API key
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow network access from your IP (or 0.0.0.0/0 for development)
3. Copy the connection string into `MONGO_URI` in `.env`, replacing `<username>`/`<password>`

### Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Create an API key and paste it into `GEMINI_API_KEY` in `.env`

## 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` to the backend.

### Add the Krishna flute audio

Drop a royalty-free instrumental MP3 at:
```
frontend/public/audio/krishna-flute.mp3
```
See `frontend/public/audio/README.txt` for suggested royalty-free sources.

## 3. Test the API

```bash
curl http://localhost:5000/api/health
```

## 4. Deployment

**Backend**: Deploy to Render, Railway, or Fly.io. Set the same environment variables as `.env`. Set `CLIENT_URL` to your deployed frontend URL.

**Frontend**: Deploy to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's `/api` URL.

## What's included in this build

Auth (register/login/JWT), onboarding, dashboard, **Ask Krishna** (signature Gita-wisdom feature with music controller), Talk to Sukoon (AI companion chat), Mood Tracker, Journal ("Your Quiet Corner"), Gratitude Garden, Breathe With Me, Unload Your Mind (AI thought sorter), Sleep Wind-Down, Insights (analytics + AI weekly reflection), Profile, Settings, SOS grounding mode, responsive sidebar/mobile nav, full backend MVC architecture with all models/controllers/routes described in the spec.

## Not yet included (send "CONTINUE" to add)

Self-care task UI on dashboard, affirmation/reflection swipeable cards, gamification achievement-award logic (schema + display exist, award triggers not yet wired), full trusted-contacts UI in SOS mode, light-mode palette refinement, and additional polish/microinteractions.
