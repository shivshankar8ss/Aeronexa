import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [exposure, setExposure] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get browser location
  const getLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        reject
      );
    });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 1. Get user location
        const coords = await getLocation();

        // 2. Resolve micro-zone
        const zoneRes = await api.post("/zones/resolve", {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        const zoneId = zoneRes.data.data._id;

        // 3. Fetch exposure + alerts
        const exposureRes = await api.get("/exposure/daily");
        setExposure(exposureRes.data.data);

        const alertRes = await api.get(`/alerts/${zoneId}`);
        setAlerts(alertRes.data.data);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            🌍 Pollution Dashboard
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Exposure Card */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">
            🫁 Daily Exposure Summary
          </h2>

          {exposure ? (
            <div className="space-y-1">
              <p>
                <b>Total Minutes:</b> {exposure.totalMinutes}
              </p>
              <p>
                <b>Average AQI:</b>{" "}
                {Math.round(exposure.avgAQI)}
              </p>
            </div>
          ) : (
            <p>No exposure data available</p>
          )}
        </div>

        {/* Alerts */}
        <h2 className="text-xl font-semibold mb-3">
          🚨 Pollution Alerts
        </h2>

        {alerts.length === 0 ? (
          <p className="text-green-600">
            No alerts in your area 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`border-l-4 p-4 rounded shadow bg-white
                  ${
                    alert.riskLevel === "high"
                      ? "border-red-500 bg-red-50"
                      : alert.riskLevel === "medium"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-green-500 bg-green-50"
                  }`}
              >
                <h3 className="font-semibold">
                  ⚠️ {alert.riskLevel.toUpperCase()} RISK
                </h3>
                <p>{alert.message}</p>
                <small className="text-gray-600">
                  {new Date(alert.triggeredAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
