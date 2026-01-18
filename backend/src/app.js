const express = require("express");
const pollutionRoutes = require("./routes/pollution.routes");
const predictionRoutes = require("./routes/prediction.routes");
const alertRoutes = require("./routes/alert.routes");
const exposureRoutes = require("./routes/exposure.routes");
const authRoutes = require("./routes/auth.routes");
const zoneRoutes = require("./routes/zone.routes");
const cors = require("cors");


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/pollution", pollutionRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/exposure", exposureRoutes);
app.use("/api/zones", zoneRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
module.exports = app;