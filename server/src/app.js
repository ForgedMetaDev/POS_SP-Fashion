const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'POS backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
