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

// Aggregated data for login/demo
app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body || {};

    // fetch from DB
    const [settings] = await db('settings').select('*').limit(1);
    const users = await db('users').select('*').orderBy('created_at', 'desc');
    const products = await db('products').select('*').orderBy('created_at', 'desc');
    const expenses = await db('expenses').select('*').orderBy('date', 'desc');

    // choose user if exists, else dummy
    let user = users.find(u => u.email === email);

    // If DB empty, provide dummy data for demo
    const useDummy = (!users.length && !products.length && !expenses.length);

    const dummyUsers = [
      { id: 1, name: 'Alice Admin', role: 'admin', email: 'alice@example.com', status: 'active' },
      { id: 2, name: 'Bob Staff', role: 'staff', email: 'bob@example.com', status: 'active' },
      { id: 3, name: 'Carol Manager', role: 'manager', email: 'carol@example.com', status: 'active' }
    ];
    const dummyProducts = [
      { id: 1, name: 'Laptop Pro 14"', sku: 'LP14-PRO', category: 'Computers', quantity: 12, supplier: 'TechSupply', purchase_price: 900, sale_price: 1299, status: 'active', low_stock_threshold: 5 },
      { id: 2, name: 'Wireless Mouse', sku: 'WM-200', category: 'Accessories', quantity: 85, supplier: 'GadgetHub', purchase_price: 10, sale_price: 24.99, status: 'active', low_stock_threshold: 20 },
      { id: 3, name: 'USB-C Hub', sku: 'HUB-7IN1', category: 'Accessories', quantity: 34, supplier: 'GadgetHub', purchase_price: 18, sale_price: 39.99, status: 'active', low_stock_threshold: 10 }
    ];
    const dummyExpenses = [
      { id: 1, date: '2025-09-01', category: 'Rent', amount: 1500.00, description: 'Warehouse rent' },
      { id: 2, date: '2025-09-10', category: 'Utilities', amount: 220.40, description: 'Electricity and water' },
      { id: 3, date: '2025-09-15', category: 'Supplies', amount: 310.75, description: 'Packing materials' }
    ];
    const dummySettings = { id: 1, company_name: 'Acme Retail', currency: 'USD', timezone: 'UTC', default_low_stock_threshold: 10 };

    const respUsers = useDummy ? dummyUsers : users;
    const respProducts = useDummy ? dummyProducts : products;
    const respExpenses = useDummy ? dummyExpenses : expenses;
    const respSettings = useDummy ? dummySettings : settings;

    if (!user) {
      user = (useDummy ? respUsers.find(u => u.email === (email || 'alice@example.com')) : users[0]) || respUsers[0];
    }

    // Simple relationship: assign products to users in a round-robin for demo
    const productAssignments = respProducts.map((p, idx) => ({
      product_id: p.id,
      user_id: respUsers[(idx % respUsers.length)].id
    }));

    res.json({
      status: 'logged_in',
      user,
      users: respUsers,
      products: respProducts,
      expenses: respExpenses,
      settings: respSettings || null,
      relationships: { productAssignments }
    });
  } catch (e) {
    // On error, still return dummy data for demo
    const users = [
      { id: 1, name: 'Alice Admin', role: 'admin', email: 'alice@example.com', status: 'active' },
      { id: 2, name: 'Bob Staff', role: 'staff', email: 'bob@example.com', status: 'active' }
    ];
    const products = [
      { id: 1, name: 'Laptop', sku: 'LAP-001', category: 'Computers', quantity: 10, supplier: 'TechSupply', purchase_price: 800, sale_price: 1199, status: 'active', low_stock_threshold: 5 },
      { id: 2, name: 'Mouse', sku: 'MSE-010', category: 'Accessories', quantity: 60, supplier: 'GadgetHub', purchase_price: 8, sale_price: 19.99, status: 'active', low_stock_threshold: 20 }
    ];
    const expenses = [
      { id: 1, date: '2025-09-01', category: 'Rent', amount: 1200, description: 'Office rent' },
      { id: 2, date: '2025-09-10', category: 'Supplies', amount: 200, description: 'Stationery' }
    ];
    const settings = { id: 1, company_name: 'Demo Co', currency: 'USD', timezone: 'UTC', default_low_stock_threshold: 10 };
    const productAssignments = products.map((p, i) => ({ product_id: p.id, user_id: users[i % users.length].id }));
    res.json({ status: 'logged_in', user: users[0], users, products, expenses, settings, relationships: { productAssignments } });
  }
});

// Aggregated data anytime
app.get('/api/data', async (_req, res) => {
  try {
    const [settings] = await db('settings').select('*').limit(1);
    const users = await db('users').select('*').orderBy('created_at', 'desc');
    const products = await db('products').select('*').orderBy('created_at', 'desc');
    const expenses = await db('expenses').select('*').orderBy('date', 'desc');

    const useDummy = (!users.length && !products.length && !expenses.length);

    const dummyUsers = [
      { id: 1, name: 'Alice Admin', role: 'admin', email: 'alice@example.com', status: 'active' },
      { id: 2, name: 'Bob Staff', role: 'staff', email: 'bob@example.com', status: 'active' }
    ];
    const dummyProducts = [
      { id: 1, name: 'Laptop', sku: 'LAP-001', category: 'Computers', quantity: 10, supplier: 'TechSupply', purchase_price: 800, sale_price: 1199, status: 'active', low_stock_threshold: 5 },
      { id: 2, name: 'Mouse', sku: 'MSE-010', category: 'Accessories', quantity: 60, supplier: 'GadgetHub', purchase_price: 8, sale_price: 19.99, status: 'active', low_stock_threshold: 20 }
    ];
    const dummyExpenses = [
      { id: 1, date: '2025-09-01', category: 'Rent', amount: 1200, description: 'Office rent' },
      { id: 2, date: '2025-09-10', category: 'Supplies', amount: 200, description: 'Stationery' }
    ];
    const dummySettings = { id: 1, company_name: 'Demo Co', currency: 'USD', timezone: 'UTC', default_low_stock_threshold: 10 };

    const respUsers = useDummy ? dummyUsers : users;
    const respProducts = useDummy ? dummyProducts : products;
    const respExpenses = useDummy ? dummyExpenses : expenses;
    const respSettings = useDummy ? dummySettings : settings;

    const productAssignments = respProducts.map((p, i) => ({ product_id: p.id, user_id: respUsers[i % respUsers.length].id }));

    res.json({ users: respUsers, products: respProducts, expenses: respExpenses, settings: respSettings || null, relationships: { productAssignments } });
  } catch (_e) {
    const users = [
      { id: 1, name: 'Alice Admin', role: 'admin', email: 'alice@example.com', status: 'active' },
      { id: 2, name: 'Bob Staff', role: 'staff', email: 'bob@example.com', status: 'active' }
    ];
    const products = [
      { id: 1, name: 'Laptop', sku: 'LAP-001', category: 'Computers', quantity: 10, supplier: 'TechSupply', purchase_price: 800, sale_price: 1199, status: 'active', low_stock_threshold: 5 },
      { id: 2, name: 'Mouse', sku: 'MSE-010', category: 'Accessories', quantity: 60, supplier: 'GadgetHub', purchase_price: 8, sale_price: 19.99, status: 'active', low_stock_threshold: 20 }
    ];
    const expenses = [
      { id: 1, date: '2025-09-01', category: 'Rent', amount: 1200, description: 'Office rent' },
      { id: 2, date: '2025-09-10', category: 'Supplies', amount: 200, description: 'Stationery' }
    ];
    const settings = { id: 1, company_name: 'Demo Co', currency: 'USD', timezone: 'UTC', default_low_stock_threshold: 10 };
    const productAssignments = products.map((p, i) => ({ product_id: p.id, user_id: users[i % users.length].id }));
    res.json({ users, products, expenses, settings, relationships: { productAssignments } });
  }
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


