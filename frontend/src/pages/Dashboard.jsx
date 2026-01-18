import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import ExposureCard from "../components/ExposureCard";
import AlertCard from "../components/AlertCard";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [exposure, setExposure] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const ZONE_ID = "696bcd454ec304d850d2aa08";

  useEffect(() => {
    const fetchExposure = async () => {
      try {
        const res = await api.get("/exposure/daily");
        setExposure(res.data.data);

        const alertRes = await api.get(`/alerts/${ZONE_ID}`);
        setAlerts(alertRes.data.data);
      } catch (err) {
        console.error("Failed to fetch exposure", err);
      }
    };

    fetchExposure();
  }, []);

  return (
    <div style={{ padding: "20px" }}> 
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <ExposureCard exposure={exposure} />
       <h3>Recent Alerts</h3>
       {alerts.length === 0 ? (
        <p>No alerts</p>
      ) : (
        alerts.map((alert) => (
          <AlertCard key={alert._id} alert={alert} />
        ))
      )}
    </div>
  );
};

export default Dashboard;
