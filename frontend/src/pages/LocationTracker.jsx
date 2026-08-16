import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const LocationTracker = () => {
  const [locations, setLocations] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const userName = localStorage.getItem('userName');

  const fetchLocations = () => {
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Error fetching locations:", err));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const shareLocation = () => {
    if (!userName) {
      setStatusMessage('You must be logged in to share your location.');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          fetch('http://localhost:5000/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              volunteer_name: userName,
              latitude,
              longitude
            })
          })
          .then(res => res.json())
          .then(() => {
            setStatusMessage('Location shared successfully!');
            fetchLocations();
          })
          .catch(err => {
            console.error("Error saving location:", err);
            setStatusMessage('Failed to save location.');
          });
        },
        (error) => {
          setStatusMessage('Geolocation error: ' + error.message);
        }
      );
    } else {
      setStatusMessage('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Live Volunteer Location Tracker</h2>
        <p style={styles.subtitle}>Share and view active volunteer locations</p>

        {userName ? (
          <div style={styles.shareBox}>
            <button onClick={shareLocation} style={styles.button}>Share My Current Location</button>
            {statusMessage && <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#27ae60' }}>{statusMessage}</p>}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>Please login to share your location.</p>
        )}

        <div style={{ marginTop: '30px' }}>
          <h3>Active Volunteer Locations</h3>
          {locations.length === 0 ? (
            <p>No locations shared yet.</p>
          ) : (
            locations.map(loc => (
              <div key={loc.id} style={styles.card}>
                <h4 style={{ margin: '0 0 5px 0', color: '#2980b9' }}>{loc.volunteer_name}</h4>
                <p style={{ margin: '3px 0', fontSize: '14px' }}><strong>Latitude:</strong> {loc.latitude}</p>
                <p style={{ margin: '3px 0', fontSize: '14px' }}><strong>Longitude:</strong> {loc.longitude}</p>
                <small style={{ color: '#7f8c8d' }}>Last Updated: {new Date(loc.updated_at).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' },
  title: { color: '#2c3e50', textAlign: 'center', margin: '0 0 5px 0' },
  subtitle: { color: '#7f8c8d', textAlign: 'center', marginBottom: '20px' },
  shareBox: { textAlign: 'center', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' },
  button: { backgroundColor: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  card: { backgroundColor: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
};

export default LocationTracker;