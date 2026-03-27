import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import inventoryRoutes from './routes/inventory';
import salesRoutes from './routes/sales';
import mlRoutes from './routes/ml';

const app = express();
const port = process.env['PORT'] || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/ml', mlRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`API Server running on port ${port}`);
});
