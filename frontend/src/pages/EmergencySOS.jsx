import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify'; // Toastify Import

const EmergencySOS = () => {
  const [requests, setRequests] = useState([]);
  const [issueType, setIssueType] = useState('Medical Emergency');
  const userName = localStorage.getItem('userName');

  const fetchSOSRequests = () => {
    fetch('http://localhost:5000/api/sos')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error("Error fetching SOS:", err));
  };

  useEffect(() => {
    fetchSOSRequests();
  }, []);

  const sendSOS = () => {
    if (!userName) {
      toast.error('You must be logged in to send an SOS.'); // Error Toast
      return;
    }

    toast.info('Fetching location and sending SOS...'); // Info Toast

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          fetch('http://localhost:5000/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requester_name: userName,
              latitude,
              longitude,
              issue_type: issueType
            })
          })
          .then(res => res.json())
          .then(() => {
            toast.success('🚨 SOS Request Sent Successfully!'); // Success Toast
            fetchSOSRequests();
          })
          .catch(() => toast.error('Failed to send SOS.'));
        },
        (error) => toast.warning('Geolocation error: Please allow location access.')
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const resolveSOS = (id) => {
    fetch(`http://localhost:5000/api/sos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })
    }).then(() => {
      toast.success('Issue marked as resolved! ✅'); // Success Toast
      fetchSOSRequests();
    });
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={{ color: '#c0392b', textAlign: 'center' }}>🚨 Emergency SOS</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>Request immediate help from nearby volunteers</p>

        {/* SOS Send Box */}
        <div style={styles.sosBox}>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)} style={styles.select}>
            <option value="Medical Emergency">Medical Emergency</option>
            <option value="Blood Needed">Blood Needed</option>
            <option value="Accident">Accident</option>
            <option value="Oxygen Required">Oxygen Required</option>
          </select>
          <button onClick={sendSOS} style={styles.sosButton}>SEND SOS NOW</button>
        </div>

        {/* Active Requests List */}
        <div style={{ marginTop: '40px' }}>
          <h3>Live Help Requests</h3>
          {requests.length === 0 ? <p>No active emergency requests.</p> : (
            requests.map(req => (
              <div key={req.id} style={{ ...styles.card, borderLeft: req.status === 'Pending' ? '5px solid #e74c3c' : '5px solid #27ae60' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#c0392b' }}>{req.issue_type}</h4>
                    <p style={{ margin: '3px 0' }}><strong>Requested by:</strong> {req.requester_name}</p>
                    <p style={{ margin: '3px 0', fontSize: '13px' }}>
                      📍 Location: {req.latitude}, {req.longitude} 
                      <a href={`https://www.google.com/maps?q=${req.latitude},${req.longitude}`} target="_blank" rel="noreferrer" style={{ marginLeft: '10px', color: '#3498db' }}>View on Map</a>
                    </p>
                    <p style={{ margin: '3px 0', fontSize: '12px', color: '#7f8c8d' }}>Time: {new Date(req.created_at).toLocaleString()}</p>
                  </div>
                  
                  {/* Resolve Button */}
                  {req.status === 'Pending' ? (
                    <button onClick={() => resolveSOS(req.id)} style={styles.resolveBtn}>Mark as Resolved</button>
                  ) : (
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Resolved ✅</span>
                  )}
                </div>
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
  sosBox: { textAlign: 'center', backgroundColor: '#fee2e2', padding: '30px', borderRadius: '10px', border: '2px solid #ef4444' },
  select: { padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px', width: '250px' },
  sosButton: { backgroundColor: '#e74c3c', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(231, 76, 60, 0.4)' },
  card: { backgroundColor: '#fff', padding: '15px', borderRadius: '6px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  resolveBtn: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default EmergencySOS;