import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are logged in</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
