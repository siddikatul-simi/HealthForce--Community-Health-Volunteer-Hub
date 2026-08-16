const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Status API
app.get('/api/status', (req, res) => {
    res.json({ message: "HealthForce Backend is successfully connected!" });
});

// Register API
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("Error registering user:", err);
            return res.status(500).json({ error: "Email already exists or database error." });
        }
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length > 0) {
            const user = results[0];
            res.status(200).json({ 
                message: "Login successful", 
                token: "fake-jwt-token", 
                name: user.name 
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// Get All Volunteers API
app.get('/api/volunteers', (req, res) => {
    const sql = "SELECT id, name, email, role FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching volunteers:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json(results);
    });
});

// Add Health Report API
app.post('/api/reports', (req, res) => {
    const { title, description, author } = req.body;
    const sql = "INSERT INTO reports (title, description, author) VALUES (?, ?, ?)";
    db.query(sql, [title, description, author], (err, result) => {
        if (err) {
            console.error("Error saving report:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Report submitted successfully!" });
    });
});

// Get All Reports API
app.get('/api/reports', (req, res) => {
    const sql = "SELECT * FROM reports ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching reports:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json(results);
    });
});

// Save or Update Location API
app.post('/api/location', (req, res) => {
    const { volunteer_name, latitude, longitude } = req.body;
    const checkSql = "SELECT * FROM locations WHERE volunteer_name = ?";
    
    db.query(checkSql, [volunteer_name], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        if (results.length > 0) {
            const updateSql = "UPDATE locations SET latitude = ?, longitude = ? WHERE volunteer_name = ?";
            db.query(updateSql, [latitude, longitude, volunteer_name], (err, result) => {
                if (err) return res.status(500).json({ error: "Database error" });
                res.status(200).json({ message: "Location updated successfully!" });
            });
        } else {
            const insertSql = "INSERT INTO locations (volunteer_name, latitude, longitude) VALUES (?, ?, ?)";
            db.query(insertSql, [volunteer_name, latitude, longitude], (err, result) => {
                if (err) return res.status(500).json({ error: "Database error" });
                res.status(201).json({ message: "Location saved successfully!" });
            });
        }
    });
});

// Get All Locations API
app.get('/api/locations', (req, res) => {
    db.query("SELECT * FROM locations", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json(results);
    });
});

// --- EMERGENCY SOS APIs ---
app.post('/api/sos', (req, res) => {
    const { requester_name, latitude, longitude, issue_type } = req.body;
    const sql = "INSERT INTO sos_requests (requester_name, latitude, longitude, issue_type) VALUES (?, ?, ?, ?)";
    db.query(sql, [requester_name, latitude, longitude, issue_type], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(201).json({ message: "SOS Request sent successfully!" });
    });
});

app.get('/api/sos', (req, res) => {
    const sql = "SELECT * FROM sos_requests ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json(results);
    });
});

app.put('/api/sos/:id', (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE sos_requests SET status = ? WHERE id = ?";
    db.query(sql, [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json({ message: "SOS status updated!" });
    });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});