import { useEffect, useState } from "react";
import StatusCard from "../components/StatusCard";
import AutoRefreshWrapper from "../components/AutoRefreshWrapper";
import "./Dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [timestamp, setTimestamp] = useState(Date.now());

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const loadStatus = async () => {
    const res = await fetch(`${apiBase}/status`);
    const json = await res.json();
    setData(json.data);
    setTimestamp(Date.now());
  };

  useEffect(() => {
    fetch(`${apiBase}/incidents`)
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error("Error loading incidents:", err));
  }, [apiBase]);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5005);
    return () => clearInterval(interval);
  }, [apiBase]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Datacenter Status Overview</h1>

      <AutoRefreshWrapper refreshKey={timestamp}>
        <div className="status-grid">
          {data.map(dc => (
            <StatusCard key={dc.id} dc={dc} incidents={incidents} />
          ))}
        </div>
      </AutoRefreshWrapper>
    </div>
  );
}
