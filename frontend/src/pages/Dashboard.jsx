import { useEffect, useState } from "react";
import StatusCard from "../components/StatusCard";
import AutoRefreshWrapper from "../components/AutoRefreshWrapper";
import "./Dashboard.css";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [timestamp, setTimestamp] = useState(Date.now());

  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.DEV) {
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
}

  const loadStatus = async () => {
    try {
      const res = await fetch(`${apiBase}/status`);
      const json = await res.json();

      // Replace "Unknown" with "Waiting"
      const cleaned = json.incidents.map(([provider, status, subject]) => [
        provider,
        status === "Unknown" ? "Waiting" : status,
        subject,
      ]);

      setIncidents(cleaned);
      setTimestamp(Date.now());
    } catch (error) {
      console.error("Error fetching /status:", error);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, [apiBase]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Datacenter Network Status </h1>

      <AutoRefreshWrapper refreshKey={timestamp}>
        <div className="status-grid">
          {incidents.map((item, index) => {
            const [provider, status, subject] = item;

            return (
              <StatusCard
                key={index}
                incident={{ provider, status, subject }}
              />
            );
          })}
        </div>
      </AutoRefreshWrapper>
    </div>
  );
}
