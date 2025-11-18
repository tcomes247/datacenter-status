
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/status')
      .then(response => setIncidents(response.data.incidents))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Network Status</h1>
      {incidents.map((incident, index) => (
        <div key={index} style={{border: '1px solid black', margin: '10px', padding: '10px'}}>
          <p>{incident.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
