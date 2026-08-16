import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>HealthForce</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/volunteers" style={styles.link}>Volunteers</Link>
        <Link to="/reports" style={styles.link}>Reports</Link>
        <Link to="/tracking" style={styles.link}>Tracking</Link>
        <Link to="/sos" style={{ ...styles.link, color: '#ffcccc', fontWeight: 'bold' }}>🚨 SOS</Link>
        <Link to="/map" style={{ ...styles.link, color: '#f1c40f', fontWeight: 'bold' }}>🗺️ Live Map</Link>
        {userName && <Link to="/profile" style={styles.link}>Profile</Link>}
        
        {userName ? (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px' 
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px'
  },
  loginBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default Navbar;