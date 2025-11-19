import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Call your backend API
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(
          "https://datacenter-status.onrender.com/incidents"
        );
        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 60_000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Datacenter Status</h1>

      {loading ? (
        <p>Loading incidents...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Datacenter</th>
              <th>Status</th>
              <th>Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <tr key={index}>
                <td>{incident.name}</td>

                <td>
                  {incident.status === "UP" ? (
                    <span className="status up">UP</span>
                  ) : incident.status === "DOWN" ? (
                    <span className="status down">DOWN</span>
                  ) : (
                    <span className="status incident">Incident</span>
                  )}
                </td>

                <td>{incident.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
