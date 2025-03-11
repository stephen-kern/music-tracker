import express from 'express';
import cors from 'cors';
import musicRoutes from './routes/musicRoutes';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use music routes
app.use('/api/music', musicRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Hello, Music Tracker API!');
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
