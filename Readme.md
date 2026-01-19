# 🌍 Pollution Early-Warning & Micro-Zone Alert System

A **production-grade MERN stack application** that provides **location-based pollution monitoring**, **early-warning alerts**, **exposure analytics**, and **real-time AQI trends**, optimized with **Redis caching**, **rate limiting**, and **Dockerized infrastructure**.

This application provides **location-based air pollution monitoring and alerts**. It **detects the user’s area**, **tracks AQI data**, **calculates exposure**, and **displays pollution trends and warnings** through an interactive **dashboard**. The system includes backend support for **caching**, **rate limiting**, and **notifications** to ensure **efficient and reliable data delivery**.


---

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication
- Secure login & registration
- Protected APIs

### 📍 Location-Based Intelligence
- Browser geolocation
- Automatic **Micro-Zone resolution**
- Zone-specific alerts & analytics

### 🫁 Pollution Analytics
- Daily exposure calculation
- AQI time-series history (last 24 hours)
- Interactive AQI trend chart

### 🚨 Alert System
- Pollution alerts by risk level (Low / Medium / High)
- Real-time dashboard alerts
- Email notifications for **high-risk alerts**

### ⚡ Performance & Scalability
- **Redis caching** (read-through strategy)
- Cache invalidation on writes
- **Redis-based rate limiting**
- Dockerized backend services

---

## 🧠 System Architecture (High-Level)


---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts (AQI visualization)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis
- Nodemailer (Email alerts)
- JWT Authentication

### Infrastructure
- Docker
- Docker Compose

---

## 📂 Project File Structure

### Backend

```text
backend/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── email.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── pollution.controller.js
│   │   ├── alert.controller.js
│   │   ├── exposure.controller.js
│   │   └── zone.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── MicroZone.model.js
│   │   ├── PollutionReading.js
│   │   └── Alert.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── pollution.routes.js
│   │   ├── alert.routes.js
│   │   ├── exposure.routes.js
│   │   └── zone.routes.js
│   │
│   ├── services/
│   │   └── notification.service.js
│   │
│   ├── scripts/
│   │   └── seedAQI.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md


```
### Frontend

```text
frontend/
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── components/
│   │   ├── AQIChart.jsx
│   │   ├── AlertCard.jsx
│   │   └── ExposureCard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── index.css
│   ├── App.jsx
│   └── main.jsx
│
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── package.json
```

### Environment variable
```text
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pollution
JWT_SECRET=your_jwt_secret

ALERT_EMAIL=your_email@gmail.com
ALERT_EMAIL_PASS=your_email_app_password
```

## 🧪 API Highlights

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/zones/resolve` | Resolve user micro-zone |
| GET | `/api/exposure/daily` | Daily exposure summary |
| GET | `/api/alerts/:zoneId` | Zone alerts (cached) |
| GET | `/api/pollution/history/:zoneId` | AQI trend (cached) |

---

## 📈 Performance Optimizations

- **Redis read-through caching**
- **TTL-based cache expiry**
- **Write-based cache invalidation**
- **Redis-backed rate limiting**
- **Non-blocking notifications**

