# Pastebin-Lite

Pastebin-Lite is a lightweight web application that allows users to create text pastes and share them via a unique URL. Anyone with the link can view the paste content. This project is a simplified version of Pastebin, built for fast deployment and easy evaluation.

---

## Features
- Create a text paste
- Generate a unique shareable URL
- View a paste using the URL
- REST API for paste creation and retrieval

---

## Tech Stack
- **Frontend:** Next.js  
- **Backend:** Next.js API Routes (Node.js)  
- **Persistence:** Redis (Upstash)  
- **Deployment:** Vercel  

---

## Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/mika1511/Pastebin-lite
cd pastebin-lite
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
UPSTASH_REDIS_REST_URL=your_redis_url
```

### 4. Start the development server
```bash
npm run dev
```

The application will run at:
```
http://localhost:3000
```

---

## API Endpoints

### Create a Paste
```http
POST /api/pastes
```
Request Body:
```json
{
  "content": "Your paste text"
}
```

### Get a Paste
```http
GET /api/pastes/{id}
```

---

## Persistence Layer
The application uses **Redis (Upstash)** as its persistence layer:
- Each paste is stored as a key-value pair  
- The key is a unique paste ID  
- The value is the paste content  
- Redis was chosen for its low latency, simplicity, and suitability for lightweight, short-lived data  

---

## Deployment
The application is deployed on Vercel:
```
[https://pastebin-lite-chi.vercel.app](https://pastebin-lite-tg9k.vercel.app/)
```

---

## Notes
- CORS is configured to allow requests from the deployed frontend  
- Designed for automated evaluation and minimal setup  
