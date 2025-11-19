import { useEffect, useState } from "react";
import StatusCard from "../components/StatusCard";
import AutoRefreshWrapper from "../components/AutoRefreshWrapper";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [timestamp, setTimestamp] = useState(Date.now());

  const load = async () => {
    const res = await fetch("https://your-backend-url/status");
    const json = await res.json();
    setData(json.data);
    setTimestamp(Date.now());
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Datacenter Status</h1>

      <AutoRefreshWrapper refreshKey={timestamp}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {data.map(dc => <StatusCard key={dc.id} dc={dc} />)}
        </div>
      </AutoRefreshWrapper>
    </div>
  );
}
