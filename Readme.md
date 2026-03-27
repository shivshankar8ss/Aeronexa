# 🌬️ Aeronexa — Air Quality Intelligence Platform

A full-stack web application that tracks real-time air quality (AQI) based on user location, analyzes exposure, and provides personalized health insights and predictions.

---

## 📁 Project Structure

```
aeronexa/
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cache.js           # In-memory cache (node-cache)
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── aqi.controller.js
│   │   ├── health.controller.js
│   │   └── predict.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT protect + token generation
│   │   ├── error.middleware.js # Global error handler
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── aqiLog.model.js
│   │   └── healthData.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── aqi.routes.js
│   │   ├── health.routes.js
│   │   └── predict.routes.js
│   ├── services/
│   │   ├── aqi.service.js      # AQICN + OpenWeather + fallback
│   │   ├── health.service.js   # Health score calculation
│   │   ├── predict.service.js  # Moving average prediction
│   │   └── advice.service.js   # Personalized advice engine
│   ├── .env                    # ← Fill in your values here
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/                  # React.js + Tailwind CSS
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── charts/
    │   │   │   ├── AqiHistoryChart.js
    │   │   │   ├── ExposureBarChart.js
    │   │   │   └── HealthTrendChart.js
    │   │   ├── dashboard/
    │   │   │   ├── AqiHeroCard.js
    │   │   │   ├── AdvicePanel.js
    │   │   │   ├── ChartsPanel.js
    │   │   │   ├── ExposureHeatmap.js
    │   │   │   ├── HealthScoreCard.js
    │   │   │   ├── PredictionCard.js
    │   │   │   └── RecentLogsTable.js
    │   │   ├── layout/
    │   │   │   └── Layout.js
    │   │   └── ui/
    │   │       ├── AlertBanner.js
    │   │       ├── Badge.js
    │   │       ├── LoadingSpinner.js
    │   │       └── StatCard.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── AqiContext.js
    │   ├── hooks/             # (extendable)
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── HistoryPage.js
    │   │   └── ProfilePage.js
    │   ├── services/
    │   │   └── api.js         # Axios instance
    │   ├── utils/
    │   │   └── aqi.utils.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env                   # ← Set REACT_APP_API_URL
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## ⚡ Quick Start

### 1. Clone / unzip the project

```bash
cd aeronexa
```

### 2. Setup Backend

```bash
cd backend
npm install
```

**Edit `backend/.env`** — replace all dummy values:

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `AQICN_TOKEN` | Free token from https://aqicn.org/data-platform/token/ |
| `OPENWEATHER_API_KEY` | From https://openweathermap.org/api (optional fallback) |

```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

Backend runs on **http://localhost:5000**

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

**Edit `frontend/.env`** if backend URL differs from default:
```
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start
```

Frontend runs on **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login + get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/preferences` | ✅ | Update preferences |
| GET | `/api/aqi/current?lat=&lon=` | ✅ | Fetch current AQI |
| POST | `/api/aqi/log` | ✅ | Log AQI exposure |
| GET | `/api/aqi/history?days=7` | ✅ | Get exposure history |
| GET | `/api/health` | ✅ | Health score + risk level |
| GET | `/api/health/summary` | ✅ | Cached health summary |
| GET | `/api/predict?steps=6` | ✅ | AQI predictions |
| GET | `/ping` | ❌ | Health check |

---

## 🧠 Core Features

### Health Score (0–100)
- AQI < 50 → **No deduction**
- AQI 50–100 → **−0.5 pts/hour**
- AQI 100–200 → **−2 pts/hour**
- AQI 200+ → **−4 pts/hour**
- Recalculated from last 48 hours of logs

### Prediction Model
- Simple moving average over last N=8 readings
- Linear trend detection with exponential dampening
- Extendable for ML (just swap `movingAveragePredict` in `predict.service.js`)

### Caching
- In-memory cache (node-cache) with 10-minute TTL
- Cache key = `aqi_<lat>_<lon>` (rounded to 2 decimal places)
- Automatic fallback chain: AQICN → OpenWeather → Simulation

### AQI Data Sources
1. **AQICN** (primary) — Real-time global AQI feed
2. **OpenWeatherMap** (fallback) — Air pollution API
3. **Simulation** (dev fallback) — Deterministic from coordinates

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Tailwind CSS 3 |
| Charts | Chart.js 4, react-chartjs-2 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Cache | node-cache (Redis-compatible API) |
| Validation | express-validator |
| HTTP | Axios |
| Toasts | react-hot-toast |

---

## 🔒 Security

- Passwords hashed with bcrypt (salt rounds: 12)
- JWT stored in localStorage (replace with httpOnly cookie for production)
- Helmet.js for HTTP security headers
- CORS restricted to client origin
- Rate limiting: 200 requests / 15 minutes per IP
- Input validation on all endpoints

---

## 📈 Extending the App

**Add Redis caching** — Replace `node-cache` in `config/cache.js` with `ioredis`:
```js
const Redis = require('ioredis');
const client = new Redis(process.env.REDIS_URL);
```

**Add ML prediction** — Replace `movingAveragePredict` in `predict.service.js` with a call to a Python ML microservice.

**Add push notifications** — Use the Web Push API and store subscriptions in MongoDB.

---

## 📄 License

MIT — built for educational and production use.
