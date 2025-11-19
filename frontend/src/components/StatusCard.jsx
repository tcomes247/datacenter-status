import StatusIcon from "./StatusIcon";
import StatusChart from "./StatusChart";

export default function StatusCard({ dc }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #ddd",
        width: "260px",
      }}
    >
      <h3>{dc.name}</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <StatusIcon status={dc.status} />
        <p>{dc.status}</p>
      </div>

      {dc.history && <StatusChart history={dc.history} />}
    </div>
  );
}
