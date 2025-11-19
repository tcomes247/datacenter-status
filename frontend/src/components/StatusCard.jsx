import UpIcon from "../assets/Up.png";
import DownIcon from "../assets/Down.png";
import WaitingIcon from "../assets/Waiting.png";   // <-- Add a waiting icon
import "./StatusCard.css";

export default function StatusCard({ incident }) {
  const { provider, status, subject } = incident;

  // Normalize status (ensure consistent lowercase)
  const normalized = status.toLowerCase();

  const isUp = normalized === "up";
  const isDown = normalized === "down";
  const isWaiting = normalized === "waiting";

  // Choose icon
  const icon =
    isDown ? DownIcon :
    isWaiting ? WaitingIcon :
    UpIcon;

  return (
    <div className={`status-card 
      ${isDown ? "down" : ""} 
      ${isWaiting ? "waiting" : ""}`}>

      <div className="status-header">
        <img src={icon} alt="status" className="status-icon" />
        <h2 className="status-title">{provider}</h2>
      </div>

      <div className="status-details">
        <p><strong>Status:</strong> {status}</p>

        {subject && subject !== "" && (
          <p><strong>Latest Message:</strong> {subject}</p>
        )}
      </div>
    </div>
  );
}
