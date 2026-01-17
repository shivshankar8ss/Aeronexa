require("dotenv").config();
const MicroZone = require("./models/MicroZone.model");

const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const testZone = async () => {
  const exists = await MicroZone.findOne({ zoneId: "BLR-ZONE-001" });

  if (exists) {
    console.log("MicroZone already exists, skipping seed");
    return;
  }

  await MicroZone.create({
    zoneId: "BLR-ZONE-001",
    city: "Bangalore",
    center: {
      type: "Point",
      coordinates: [77.5946, 12.9716],
    },
  });

  console.log("MicroZone created");
};

testZone();
