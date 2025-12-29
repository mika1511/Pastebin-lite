
## Pastebin-Lite

Pastebin-Lite is a lightweight Pastebin-like web application that allows users to create text pastes and share them via a unique URL.  
Pastes can optionally expire based on time-to-live (TTL) or a maximum view count.

The project is built using **Node.js (backend)** and **Next.js (frontend)** and is deployed on **Vercel**.

---

## Features

- Create a paste containing arbitrary text
- Generate a shareable URL for the paste
- View paste content via the shared link
- Optional paste constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Deterministic expiry support for automated testing
- Redis-backed persistence for serverless environments

---

## Project Structure

```
pastebin/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── pages/
    ├── package.json
    └── next.config.js
```

---

## Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/mika1511/Pastebin-lite
```

---

## Backend Setup

### 2. Navigate to backend folder
```bash
cd backend
```

### 3. Install dependencies
```bash
npm install
```

### 4. Create environment variables

Create a `.env` file inside the `backend` folder:

```env
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
TEST_MODE=0
```

### 5. Start the backend server
```bash
node index.js
```

Backend runs on:

```
http://localhost:3000
```

---

## Frontend Setup

### 6. Navigate to frontend folder (open a new terminal)
```bash
cd frontend
```

### 7. Install dependencies
```bash
npm install
```

### 8. Start the frontend
```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3001
```

(or the next available port)

---

## API Endpoints

### Health Check
```http
GET /api/healthz
```

Response:
```json
{ "ok": true }
```

---

### Create a Paste
```http
POST /api/pastes
```

Request Body:
```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Response:
```json
{
  "id": "string",
  "url": "https://your-app.vercel.app/p/<id>"
}
```

---

### Fetch a Paste (API)
```http
GET /api/pastes/:id
```

Response:
```json
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

---

### View a Paste (HTML)
```http
GET /p/:id
```

- Returns HTML containing the paste content  
- Returns HTTP 404 if the paste is unavailable

---

## Deterministic Time for Testing

When `TEST_MODE=1` is set, the backend uses the request header:

```
x-test-now-ms: <milliseconds since epoch>
```

This value is treated as the current time **only for expiry logic**, enabling deterministic TTL testing by automated graders.

---

## Persistence Layer

The application uses **Redis (Upstash)** as its persistence layer.

- Each paste is stored as a Redis key-value entry
- TTL is handled using Redis expiry
- View counts are atomically updated to prevent race conditions
- Redis was chosen to ensure persistence across requests in serverless environments like Vercel

---

## Design Decisions

- Redis is used instead of in-memory storage to support serverless deployments
- All unavailable paste cases consistently return HTTP 404
- Paste content is safely rendered to prevent script execution
- No hardcoded localhost URLs are used in deployed code
- Environment variables are used for all configuration and secrets

---

## Deployment

- **Frontend:** Vercel 

- **Backend:** Vercel   

- **Persistence:** Upstash Redis



