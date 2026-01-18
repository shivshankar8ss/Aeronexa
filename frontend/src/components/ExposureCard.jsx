const ExposureCard = ({ exposure }) => {
  if (!exposure) return <p>Loading exposure...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", margin: "10px 0" }}>
      <h3>Daily Exposure</h3>
      <p>Total Time: {exposure.totalMinutes} minutes</p>
      <p>Average AQI: {Math.round(exposure.avgAQI)}</p>
    </div>
  );
};

export default ExposureCard;
