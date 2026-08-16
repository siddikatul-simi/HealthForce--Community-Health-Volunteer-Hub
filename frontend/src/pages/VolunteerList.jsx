import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/volunteers')
      .then(res => res.json())
      .then(data => {
        setVolunteers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching volunteers:", err);
        setLoading(false);
      });
  }, []);
  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Volunteer Directory</h2>
        <p style={styles.subtitle}>Find and connect with community members</p>

        {/* Search Bar Section */}
        <div style={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="🔍 Search by name or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading volunteers...</p>
        ) : (
          <div style={styles.grid}>
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map(volunteer => (
                <div key={volunteer.id} style={styles.card}>
                  <div style={styles.avatar}>👤</div>
                  <h3 style={styles.name}>{volunteer.name}</h3>
                  <p style={styles.text}><strong>Role:</strong> <span style={{ color: '#27ae60' }}>{volunteer.role}</span></p>
                  <p style={styles.text}><strong>Email:</strong> {volunteer.email}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#e74c3c', fontWeight: 'bold' }}>
                No volunteers found matching "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// CSS Styles
const styles = {
  container: { padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' },
  title: { color: '#2c3e50', textAlign: 'center', margin: '0 0 10px 0', fontSize: '2.5rem' },
  subtitle: { color: '#7f8c8d', textAlign: 'center', marginBottom: '30px' },
  searchContainer: { display: 'flex', justifyContent: 'center', marginBottom: '40px' },
  searchInput: { 
    width: '100%', 
    maxWidth: '500px', 
    padding: '15px 25px', 
    borderRadius: '30px', 
    border: '2px solid #3498db', 
    fontSize: '16px', 
    outline: 'none', 
    boxShadow: '0 4px 6px rgba(52, 152, 219, 0.2)' 
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  card: { padding: '30px 20px', border: '1px solid #e0e0e0', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' },
  avatar: { fontSize: '45px', marginBottom: '15px' },
  name: { margin: '0 0 10px 0', color: '#2980b9' },
  text: { margin: '5px 0', color: '#555', fontSize: '15px' }
};

export default VolunteerList;