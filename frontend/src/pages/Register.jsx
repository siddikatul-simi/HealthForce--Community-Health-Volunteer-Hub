import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Server error. Is the backend running?');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join HealthForce</h2>
        <p style={styles.subtitle}>Create an account to get started</p>
        
        {message && <p style={{ color: message.includes('successful') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#3498db', textDecoration: 'none' }}>Login here</Link>
        </p>
        <div style={{ marginTop: '10px' }}>
            <Link to="/" style={{ color: '#7f8c8d', textDecoration: 'none', fontSize: '14px' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f7f6'
  },
  card: {
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    color: '#2c3e50',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default Register;