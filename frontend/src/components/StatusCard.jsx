import UpIcon from "../assets/Up.png";
import DownIcon from "../assets/Down.png";
import IncidentIcon from "../assets/Incident.png";
import "./StatusCard.css";

export default function StatusCard({ dc, incidents = [] }) {
  const isDown = dc.status.toLowerCase() === "down";

  const dcIncidents = incidents.filter(i => i.datacenter_id === dc.id);

  return (
    <div className="status-card">
      <div className="status-header">
        <img
          src={isDown ? DownIcon : UpIcon}
          alt="status"
          className="status-icon"
        />
        <h2 className="status-title">{dc.name}</h2>
      </div>

      <div className="status-details">
        <p><strong>Status:</strong> {dc.status}</p>
        <p><strong>Location:</strong> {dc.location}</p>
      </div>

      {dcIncidents.length > 0 && (
        <div className="incident-section">
          <img src={IncidentIcon} className="incident-icon" alt="incident" />
          <p>{dcIncidents.length} Active Incident(s)</p>
        </div>
      )}
    </div>
  );
}
