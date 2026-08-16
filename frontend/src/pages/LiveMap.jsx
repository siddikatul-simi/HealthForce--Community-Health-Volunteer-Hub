import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '../components/Navbar';

// Fix for default Leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Red Icon for SOS Emergency
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LiveMap = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);

  useEffect(() => {
    // Fetch Volunteer Locations
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(data => setVolunteers(data))
      .catch(err => console.error(err));

    // Fetch Active SOS Requests
    fetch('http://localhost:5000/api/sos')
      .then(res => res.json())
      .then(data => setSosRequests(data.filter(req => req.status === 'Pending')))
      .catch(err => console.error(err));
  }, []);

  // Default Center (Dhaka/Ashulia, Bangladesh)
  const defaultCenter = [23.8859, 90.3278];

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🌍 Live Community Map</h2>
        <p style={styles.subtitle}>Blue Pins = Volunteers | <span style={{ color: 'red' }}>Red Pins = SOS Emergencies</span></p>

        <div style={styles.mapWrapper}>
          <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%', borderRadius: '10px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Render Volunteers (Blue Pins) */}
            {volunteers.map(vol => (
              <Marker key={`vol-${vol.id}`} position={[vol.latitude, vol.longitude]}>
                <Popup>
                  <strong>🧑‍⚕️ {vol.volunteer_name}</strong> <br />
                  Role: Volunteer <br />
                  Last Updated: {new Date(vol.updated_at).toLocaleTimeString()}
                </Popup>
              </Marker>
            ))}

            {/* Render SOS Requests (Red Pins) */}
            {sosRequests.map(sos => (
              <Marker key={`sos-${sos.id}`} position={[sos.latitude, sos.longitude]} icon={redIcon}>
                <Popup>
                  <strong style={{ color: 'red' }}>🚨 {sos.issue_type}</strong> <br />
                  Requested by: {sos.requester_name} <br />
                  Time: {new Date(sos.created_at).toLocaleTimeString()}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
  title: { color: '#2c3e50', margin: '0 0 10px 0' },
  subtitle: { color: '#7f8c8d', marginBottom: '20px', fontWeight: 'bold' },
  mapWrapper: { height: '500px', width: '100%', border: '2px solid #bdc3c7', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }
};

export default LiveMap;