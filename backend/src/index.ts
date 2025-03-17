import express from 'express';
import cors from 'cors';
import musicRoutes from './routes/musicRoutes';
import musicTestRoutes from './routes/music';

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Use music routes
app.use('/api/music', musicRoutes);
app.use('/api/music', musicTestRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Hello, Music Tracker API!');
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// print routes to terminal
app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
      console.log(`Registered route: ${r.route.path}`);
    }
  });
  