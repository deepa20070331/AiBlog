# AI Blognest

A small blog-writing workspace with a React/Vite frontend and an Express, MongoDB-backed API. The AI drafting action uses the OpenAI Chat Completions API; creating and managing posts does not require an OpenAI key.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB connection string
- An OpenAI API key to use AI drafting

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`. Add `OPENAI_API_KEY` to enable AI drafting.
2. In `backend`, run `npm install`, then `npm run dev`.
3. In `frontend`, run `npm install`, then `npm run dev`.
4. Open `http://localhost:5173`.

The API listens on port 5000 by default. Set `VITE_API_URL` in `frontend/.env` to change its base URL.