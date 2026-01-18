import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import ExposureCard from "../components/ExposureCard";
import AlertCard from "../components/AlertCard";

const getLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      reject
    );
  });


const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [exposure, setExposure] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const ZONE_ID = "696bcd454ec304d850d2aa08";

useEffect(() => {
  const fetchData = async () => {
    try {
      const coords = await getLocation();

      const zoneRes = await api.post("/zones/resolve", {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const zoneId = zoneRes.data.data._id;

      const exposureRes = await api.get("/exposure/daily");
      setExposure(exposureRes.data.data);

      const alertRes = await api.get(`/alerts/${zoneId}`);
      setAlerts(alertRes.data.data);
    } catch (err) {
      console.error("Dashboard load failed", err);
    }
  };

  fetchData();
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
