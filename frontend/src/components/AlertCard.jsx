const AlertCard = ({ alert }) => {
  const color =
    alert.riskLevel === "high"
      ? "#ffcccc"
      : alert.riskLevel === "medium"
      ? "#fff4cc"
      : "#e6ffe6";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "10px",
        backgroundColor: color,
      }}
    >
      <h4 style={{ margin: 0 }}>
        ⚠️ {alert.riskLevel.toUpperCase()} RISK
      </h4>
      <p>{alert.message}</p>
      <small>
        {new Date(alert.triggeredAt).toLocaleString()}
      </small>
    </div>
  );
};

export default AlertCard;
