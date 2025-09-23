import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import knex from 'knex';
import knexConfig from '../knexfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = knex(knexConfig.development);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, '../uploads') });

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Products CRUD
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, supplier, status } = req.query;
    let query = db('products').select('*');
    if (search) {
      query = query.where(q => {
        q.where('name', 'like', `%${search}%`).orWhere('sku', 'like', `%${search}%`);
      });
    }
    if (category) query = query.andWhere('category', category);
    if (supplier) query = query.andWhere('supplier', supplier);
    if (status) query = query.andWhere('status', status);
    const rows = await query.orderBy('created_at', 'desc');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const [product] = await db('products').insert(req.body).returning('*');
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const [product] = await db('products').where({ id: req.params.id }).update(req.body).returning('*');
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await db('products').where({ id: req.params.id }).del();
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

// Users CRUD
app.get('/api/users', async (_req, res) => {
  try {
    const rows = await db('users').select('*').orderBy('created_at', 'desc');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const [user] = await db('users').insert(req.body).returning('*');
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const [user] = await db('users').where({ id: req.params.id }).update(req.body).returning('*');
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await db('users').where({ id: req.params.id }).del();
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
});

app.post('/api/users/:id/reset-password', async (req, res) => {
  try {
    const [user] = await db('users').where({ id: req.params.id }).update({ temp_password: 'Reset123!' }).returning('*');
    res.json({ message: 'Password reset', user });
  } catch (e) {
    res.status(400).json({ error: 'Failed to reset password' });
  }
});

// Expenses CRUD
app.get('/api/expenses', async (_req, res) => {
  try {
    const rows = await db('expenses').select('*').orderBy('date', 'desc');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const [expense] = await db('expenses').insert(req.body).returning('*');
    res.status(201).json(expense);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create expense' });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const [expense] = await db('expenses').where({ id: req.params.id }).update(req.body).returning('*');
    res.json(expense);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await db('expenses').where({ id: req.params.id }).del();
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: 'Failed to delete expense' });
  }
});

// File upload for logo
app.post('/api/settings/logo', upload.single('logo'), (req, res) => {
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

// Dashboard metrics
app.get('/api/dashboard/overview', async (_req, res) => {
  try {
    const [totalStockRow] = await db('products').sum({ total: 'quantity' });
    const lowStock = await db('products').where('quantity', '<=', db.ref('low_stock_threshold')).count({ count: '*' });
    const suppliers = await db('products').distinct('supplier');
    const monthExpenses = await db('expenses').whereRaw("strftime('%Y-%m', date) = strftime('%Y-%m', 'now')").sum({ total: 'amount' });
    res.json({
      totalStock: Number(totalStockRow.total || 0),
      lowStockItems: Number(lowStock[0]?.count || 0),
      suppliers: suppliers.length,
      monthlyExpenses: Number(monthExpenses[0]?.total || 0)
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`IMS backend running on :${PORT}`);
});


