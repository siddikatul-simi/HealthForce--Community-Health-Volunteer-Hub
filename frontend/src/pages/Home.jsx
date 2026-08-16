import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const [stats, setStats] = useState({ volunteers: 0, sos: 0, reports: 0 });
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName');

  useEffect(() => {
  
    Promise.all([
      fetch('http://localhost:5000/api/volunteers').then(res => res.json()),
      fetch('http://localhost:5000/api/sos').then(res => res.json()),
      fetch('http://localhost:5000/api/reports').then(res => res.json())
    ])
    .then(([volunteersData, sosData, reportsData]) => {
      setStats({
        volunteers: volunteersData.length || 0,
        sos: sosData.filter(req => req.status === 'Pending').length || 0,
        reports: reportsData.length || 0
      });
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching stats:", err);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>HealthForce</h1>
          <h3 style={styles.subtitle}>Community Health Volunteer Hub</h3>
        </header>
        
        <main style={styles.mainContent}>
          {/* Welcome Box */}
          {userName ? (
            <div style={styles.welcomeBox}>
              <h2 style={{ margin: 0, color: '#2c3e50' }}>Welcome back, {userName}! 👋</h2>
              <p style={{ color: '#7f8c8d', marginTop: '10px' }}>Here is the current real-time overview of your community.</p>
            </div>
          ) : (
            <div style={styles.welcomeBox}>
              <h2 style={{ margin: 0, color: '#2c3e50' }}>Welcome to HealthForce!</h2>
              <p style={{ color: '#7f8c8d', marginTop: '10px' }}>Please login to participate in community health activities.</p>
            </div>
          )}

          {/* Dynamic Dashboard Stats */}
          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#3498db' }}>Loading Dashboard Data...</p>
          ) : (
            <div style={styles.dashboardGrid}>
              
              {/* Stat Card 1: Total Volunteers */}
              <div style={{ ...styles.card, borderTop: '5px solid #3498db' }}>
                <div style={styles.icon}>🧑‍⚕️</div>
                <h3 style={styles.cardNumber}>{stats.volunteers}</h3>
                <p style={styles.cardText}>Registered Volunteers</p>
                <Link to="/volunteers" style={styles.cardLink}>View Directory →</Link>
              </div>

              {/* Stat Card 2: Active SOS */}
              <div style={{ ...styles.card, borderTop: '5px solid #e74c3c' }}>
                <div style={styles.icon}>🚨</div>
                <h3 style={styles.cardNumber}>{stats.sos}</h3>
                <p style={styles.cardText}>Active Emergencies</p>
                <Link to="/sos" style={styles.cardLink}>Go to SOS Board →</Link>
              </div>

              {/* Stat Card 3: Total Reports */}
              <div style={{ ...styles.card, borderTop: '5px solid #27ae60' }}>
                <div style={styles.icon}>📋</div>
                <h3 style={styles.cardNumber}>{stats.reports}</h3>
                <p style={styles.cardText}>Community Reports</p>
                <Link to="/reports" style={styles.cardLink}>Read Reports →</Link>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// CSS Styles
const styles = {
  container: { padding: '40px 20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { color: '#2c3e50', fontSize: '3.5rem', margin: '0', fontWeight: 'bold' },
  subtitle: { color: '#34495e', margin: '10px 0 0 0', fontSize: '1.2rem' },
  mainContent: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  welcomeBox: { textAlign: 'center', marginBottom: '40px', backgroundColor: '#f4f7f6', padding: '25px 40px', borderRadius: '12px', width: '100%', maxWidth: '800px', border: '1px solid #e0e0e0' },
  dashboardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', width: '100%', maxWidth: '900px' },
  card: { backgroundColor: '#fff', padding: '30px 20px', borderRadius: '12px', boxShadow: '0 6px 15px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  icon: { fontSize: '45px', marginBottom: '10px' },
  cardNumber: { fontSize: '40px', color: '#2c3e50', margin: '10px 0', fontWeight: 'bold' },
  cardText: { color: '#7f8c8d', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' },
  cardLink: { color: '#3498db', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', marginTop: 'auto', padding: '10px 15px', backgroundColor: '#eef6fc', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }
};

export default Home;