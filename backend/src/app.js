const express = require("express");
const pollutionRoutes = require("./routes/pollution.routes");
const predictionRoutes = require("./routes/prediction.routes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
app.use("/api/pollution", pollutionRoutes);
app.use("/api/prediction", predictionRoutes);
module.exports = app;