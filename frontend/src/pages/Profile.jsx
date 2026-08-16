import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'Community Member'
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedName) {
      setUser({
        name: storedName,
        email: storedEmail || 'Not available',
        role: 'Community Member'
      });
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.avatar}>👤</div>
          <h2 style={styles.title}>{user.name}</h2>
          <p style={styles.text}><strong>Email:</strong> {user.email}</p>
          <p style={styles.text}><strong>Role:</strong> <span style={{ color: '#27ae60', fontWeight: 'bold' }}>{user.role}</span></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #e0e0e0'
  },
  avatar: {
    fontSize: '60px',
    marginBottom: '15px'
  },
  title: {
    color: '#2c3e50',
    margin: '0 0 15px 0'
  },
  text: {
    margin: '10px 0',
    color: '#555',
    fontSize: '16px'
  }
};

export default Profile;