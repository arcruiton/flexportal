import express from 'express';
import './db.js';
import productsRouter from './routes/products.js';
import customersRouter from './routes/customers.js';
import assetsRouter from './routes/assets.js';
import ordersRouter from './routes/orders.js';
import subscriptionsRouter from './routes/subscriptions.js';
import paymentsRouter from './routes/payments.js';
import statsRouter from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/stats', statsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`FlexPortal API listening on http://localhost:${PORT}`);
});
