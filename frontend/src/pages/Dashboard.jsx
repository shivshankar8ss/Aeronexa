import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import ExposureCard from "../components/ExposureCard";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [exposure, setExposure] = useState(null);

  useEffect(() => {
    const fetchExposure = async () => {
      try {
        const res = await api.get("/exposure/daily");
        setExposure(res.data.data);
      } catch (err) {
        console.error("Failed to fetch exposure", err);
      }
    };

    fetchExposure();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <ExposureCard exposure={exposure} />
    </div>
  );
};

export default Dashboard;
