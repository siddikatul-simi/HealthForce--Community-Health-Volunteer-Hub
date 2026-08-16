import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');
  const userName = localStorage.getItem('userName');

  const fetchReports = () => {
    fetch('http://localhost:5000/api/reports')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Error fetching reports:", err));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName) {
      setMessage('You must be logged in to submit a report.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          author: userName
        }),
      });

      if (response.ok) {
        setMessage('Report submitted successfully!');
        setFormData({ title: '', description: '' });
        fetchReports(); 
      } else {
        setMessage('Failed to submit report.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server error.');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Community Health Reports</h2>
        <p style={styles.subtitle}>View and submit community health activities</p>

        {/* Show the form only if the user is logged in */}
        {userName ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3>Submit a New Report</h3>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            <input
              type="text"
              name="title"
              placeholder="Report Title (e.g. Free Blood Pressure Camp)"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <textarea
              name="description"
              placeholder="Write report details here..."
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
            <button type="submit" style={styles.button}>Submit Report</button>
          </form>
        ) : (
          <p style={{ textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>Please login to submit a health report.</p>
        )}

        <div style={{ marginTop: '40px' }}>
          <h3>Recent Reports</h3>
          {reports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            reports.map(report => (
              <div key={report.id} style={styles.card}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2980b9' }}>{report.title}</h4>
                <p style={{ margin: '5px 0', color: '#333' }}>{report.description}</p>
                <small style={{ color: '#7f8c8d' }}>Posted by: <strong>{report.author}</strong> | {new Date(report.created_at).toLocaleString()}</small>
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
  subtitle: { color: '#7f8c8d', textAlign: 'center', marginBottom: '30px' },
  form: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', marginBottom: '30px' },
  input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', height: '100px', boxSizing: 'border-box' },
  button: { backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
};

export default Reports;