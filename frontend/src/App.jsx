import React, { useState } from 'react';
import './App.css';

function App() {
  const [host, setHost] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!host) {
      setError('Please enter a valid host or IP');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.result);
      }
    } catch (err) {
      setError('Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🔐 SecurePort</h1>
      <p>Enter a public IP or domain to scan common TCP ports.</p>
      <input
        type="text"
        placeholder="e.g. scanme.nmap.org"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      />
      <button onClick={handleScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Start Scan'}
      </button>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Port</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ port, status }) => (
              <tr key={port}>
                <td>{port}</td>
                <td className={status}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
